#!/usr/bin/env node
/**
 * Bulk-upload images from a local folder into Sanity as `galleryImage` documents.
 *
 * What it does:
 *   1. Walks a folder for image files (jpg, jpeg, png, webp, gif).
 *   2. Reads EXIF/metadata where available (capture date, dimensions) so you
 *      can use it for display order or just to sanity-check what got uploaded.
 *   3. Uploads each image as a Sanity asset.
 *   4. Creates a `galleryImage` document referencing that asset, with:
 *        - label        -> derived from filename (editable after upload)
 *        - alt          -> derived from filename (editable after upload)
 *        - displayOrder -> incrementing number (or EXIF capture date order)
 *        - showOnHomepage -> true (district left unset, per your instructions)
 *
 * Setup:
 *   npm install @sanity/client exifr
 *
 * Required env vars:
 *   SANITY_PROJECT_ID   your project ID
 *   SANITY_DATASET      e.g. "production"
 *   SANITY_TOKEN        a write-enabled API token
 *
 * Usage:
 *   node upload-gallery-images.js /path/to/folder-of-photos
 *
 * Optional flags:
 *   --dry-run            Scan and print what would happen, don't upload/create anything
 *   --start-order=100    Starting number for displayOrder (default 0)
 *   --sort=name|date     Sort files by filename or by EXIF capture date before assigning order (default name)
 *   --label-prefix="West Coast Conference"
 *                        Generate labels as "West Coast Conference 1", "West Coast Conference 2", etc.
 *                        (counter always starts at 1, independent of --start-order). Alt text becomes
 *                        "West Coast Conference event photo". If omitted, labels are derived from filenames.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const exifr = require('exifr');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function parseArgs(argv) {
    const args = { folder: null, dryRun: false, startOrder: 0, sort: 'name', labelPrefix: null };
    for (const arg of argv) {
        if (arg === '--dry-run') {
            args.dryRun = true;
        } else if (arg.startsWith('--start-order=')) {
            args.startOrder = parseInt(arg.split('=')[1], 10) || 0;
        } else if (arg.startsWith('--sort=')) {
            args.sort = arg.split('=')[1];
        } else if (arg.startsWith('--label-prefix=')) {
            args.labelPrefix = arg.split('=').slice(1).join('=');
        } else if (!arg.startsWith('--')) {
            args.folder = arg;
        }
    }
    return args;
}

function requireEnv(name) {
    const val = process.env[name];
    if (!val) {
        console.error(`Missing required environment variable: ${name}`);
        process.exit(1);
    }
    return val;
}

// Turn "2025-annual-conference_04.jpg" into "2025 Annual Conference 04"
function humanizeFilename(filename) {
    const base = path.basename(filename, path.extname(filename));
    const spaced = base.replace(/[_-]+/g, ' ').trim();
    return spaced
        .split(' ')
        .map((word) => (word.length ? word[0].toUpperCase() + word.slice(1) : word))
        .join(' ');
}

async function getImageFiles(folder) {
    const entries = await fs.promises.readdir(folder, { withFileTypes: true });
    return entries
        .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
        .map((e) => path.join(folder, e.name));
}

async function readMetadata(filePath) {
    try {
        const buffer = await fs.promises.readFile(filePath);
        const exif = await exifr.parse(buffer, { pick: ['DateTimeOriginal', 'CreateDate', 'ImageWidth', 'ImageHeight'] });
        return {
            captureDate: exif?.DateTimeOriginal || exif?.CreateDate || null,
            width: exif?.ImageWidth || null,
            height: exif?.ImageHeight || null,
        };
    } catch (err) {
        // Not all images have EXIF (e.g. PNGs, screenshots) — that's fine, just skip it.
        return { captureDate: null, width: null, height: null };
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (!args.folder) {
        console.error('Usage: node upload-gallery-images.js /path/to/folder [--dry-run] [--start-order=0] [--sort=name|date]');
        process.exit(1);
    }

    const folder = path.resolve(args.folder);
    if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
        console.error(`Not a valid folder: ${folder}`);
        process.exit(1);
    }

    const projectId = requireEnv('SANITY_PROJECT_ID');
    const dataset = requireEnv('SANITY_DATASET');
    const token = requireEnv('SANITY_TOKEN');

    const client = createClient({
        projectId,
        dataset,
        token,
        apiVersion: '2024-01-01',
        useCdn: false,
    });

    const files = await getImageFiles(folder);
    if (files.length === 0) {
        console.log('No image files found in that folder.');
        return;
    }

    console.log(`Found ${files.length} image(s) in ${folder}`);

    // Gather metadata for every file up front so we can sort by capture date if requested.
    const items = [];
    for (const filePath of files) {
        const meta = await readMetadata(filePath);
        items.push({ filePath, meta });
    }

    if (args.sort === 'date') {
        items.sort((a, b) => {
            const da = a.meta.captureDate ? new Date(a.meta.captureDate).getTime() : Infinity;
            const db = b.meta.captureDate ? new Date(b.meta.captureDate).getTime() : Infinity;
            return da - db;
        });
    } else {
        items.sort((a, b) => a.filePath.localeCompare(b.filePath));
    }

    let order = args.startOrder;
    let labelCounter = 1;
    let successCount = 0;
    let failCount = 0;

    for (const { filePath, meta } of items) {
        const filename = path.basename(filePath);
        const label = args.labelPrefix ? `${args.labelPrefix} ${labelCounter}` : humanizeFilename(filename);
        const alt = args.labelPrefix ? 'West Coast Conference event photo' : label; // starting point — go edit these in the Studio for anything that needs a real description
        labelCounter += 1;

        console.log(`\n[order ${order}] ${filename}`);
        console.log(`  label: "${label}"`);
        if (meta.captureDate) console.log(`  captured: ${meta.captureDate}`);
        if (meta.width && meta.height) console.log(`  dimensions: ${meta.width}x${meta.height}`);

        if (args.dryRun) {
            order += 1;
            continue;
        }

        try {
            const stream = fs.createReadStream(filePath);
            const asset = await client.assets.upload('image', stream, { filename });

            const doc = {
                _type: 'galleryImage',
                image: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id },
                },
                label,
                alt,
                displayOrder: order,
                showOnHomepage: true,
                // district intentionally left unset — set manually in Studio per your instructions
            };

            const created = await client.create(doc);
            console.log(`  ✓ created document ${created._id}`);
            successCount += 1;
        } catch (err) {
            console.error(`  ✗ failed: ${err.message}`);
            failCount += 1;
        }

        order += 1;
    }

    console.log(`\nDone. ${successCount} uploaded, ${failCount} failed${args.dryRun ? ' (dry run — nothing was actually uploaded)' : ''}.`);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});