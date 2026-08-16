#!/usr/bin/env node
/**
 * Relabel + renumber existing `galleryImage` documents in Sanity.
 *
 * What it does:
 *   1. Fetches every galleryImage doc, along with the original uploaded
 *      filename (Sanity keeps this on the asset even after upload).
 *   2. Extracts the year from that filename (expects a leading YYYYMMDD,
 *      e.g. "20220623_204823.jpg" -> 2022). Falls back to the doc's
 *      _createdAt year if the filename doesn't match that pattern.
 *   3. Sorts all docs chronologically by that extracted date so ordering
 *      stays sensible within and across years.
 *   4. Patches each doc:
 *        - label -> "West Coast <year>"
 *        - order -> sequential 1, 2, 3, ... N (chronological)
 *        - year  -> numeric year (added so the gallery page can group by it)
 *
 * Required env vars: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN
 *
 * Usage:
 *   node relabel-and-renumber.js --dry-run     # preview changes, no writes
 *   node relabel-and-renumber.js               # actually apply changes
 *
 * Optional:
 *   --start-order=1     Starting number for order (default 1)
 */

const { createClient } = require('@sanity/client');

function parseArgs(argv) {
    const args = { dryRun: false, startOrder: 1 };
    for (const arg of argv) {
        if (arg === '--dry-run') args.dryRun = true;
        else if (arg.startsWith('--start-order=')) args.startOrder = parseInt(arg.split('=')[1], 10) || 1;
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

// "20220623_204823.jpg" -> { year: 2022, sortKey: "20220623204823" }
// Falls back to null if the filename doesn't start with an 8-digit date.
function extractDateFromFilename(filename) {
    if (!filename) return null;
    const match = filename.match(/^(\d{4})(\d{2})(\d{2})[_-]?(\d{2})?(\d{2})?(\d{2})?/);
    if (!match) return null;
    const [, year, month, day, hh = '00', mm = '00', ss = '00'] = match;
    const y = parseInt(year, 10);
    if (y < 2000 || y > 2100) return null; // sanity guard against false positives
    return { year: y, sortKey: `${year}${month}${day}${hh}${mm}${ss}` };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

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

    const query = `*[_type == "galleryImage"]{
    _id,
    _createdAt,
    label,
    order,
    "originalFilename": image.asset->originalFilename
  }`;

    const docs = await client.fetch(query);
    console.log(`Found ${docs.length} galleryImage document(s).`);

    const withDates = docs.map((doc) => {
        const extracted = extractDateFromFilename(doc.originalFilename);
        const year = extracted ? extracted.year : new Date(doc._createdAt).getFullYear();
        const sortKey = extracted ? extracted.sortKey : doc._createdAt.replace(/\D/g, '');
        return { ...doc, year, sortKey };
    });

    withDates.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    let order = args.startOrder;
    const patches = withDates.map((doc) => {
        const label = `West Coast ${doc.year}`;
        const patch = { _id: doc._id, label, order, year: doc.year };
        order += 1;
        return patch;
    });

    console.log('\nPreview (first 10 and last 10):');
    const preview = [...patches.slice(0, 10), ...(patches.length > 20 ? [{ _id: '...' }] : []), ...patches.slice(-10)];
    for (const p of preview) {
        if (p._id === '...') {
            console.log('  ...');
            continue;
        }
        console.log(`  [order ${p.order}] ${p._id} -> label: "${p.label}", year: ${p.year}`);
    }

    if (args.dryRun) {
        console.log(`\nDry run — no changes written. ${patches.length} document(s) would be updated.`);
        return;
    }

    console.log(`\nApplying ${patches.length} patch(es)...`);
    const tx = client.transaction();
    for (const p of patches) {
        tx.patch(p._id, { set: { label: p.label, order: p.order, year: p.year } });
    }
    await tx.commit();
    console.log('Done.');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});