'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

type GalleryImage = { url: string; label?: string; alt: string };

export function YearSection({
                                year,
                                images,
                                defaultOpen,
                            }: {
    year: number | string;
    images: GalleryImage[];
    defaultOpen: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-3 mb-6 group"
                aria-expanded={open}
            >
                <h2
                    className="text-[#0A1F44] border-b-2 border-[#C9A84C] pb-2"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}
                >
                    {year}
                </h2>
                <span className="text-sm text-gray-500">({images.length} photo{images.length === 1 ? '' : 's'})</span>
                <span
                    className="text-[#0A1F44] text-xl transition-transform duration-200 group-hover:text-[#C9A84C]"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                >
                    &#9660;
                </span>
            </button>
            {open && <GalleryLightbox images={images} />}
        </div>
    );
}

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const close = useCallback(() => setActiveIndex(null), []);
    const showPrev = useCallback(() => {
        setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    }, [images.length]);
    const showNext = useCallback(() => {
        setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
    }, [images.length]);

    useEffect(() => {
        if (activeIndex === null) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [activeIndex, close, showPrev, showNext]);

    const active = activeIndex !== null ? images[activeIndex] : null;

    return (
        <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-zoom-in text-left"
                        aria-label={`Open ${image.label || image.alt} in full size`}
                    >
                        <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {image.label && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A1F44]/90 to-transparent px-4 py-3">
                                <p className="text-white" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                    {image.label}
                                </p>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {active && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
                    onClick={close}
                    role="dialog"
                    aria-modal="true"
                    aria-label={active.label || active.alt}
                >
                    <button
                        type="button"
                        onClick={close}
                        className="absolute top-4 right-4 text-white text-3xl leading-none w-10 h-10 flex items-center justify-center hover:text-[#C9A84C] transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            showPrev();
                        }}
                        className="absolute left-2 sm:left-6 text-white text-4xl leading-none w-12 h-12 flex items-center justify-center hover:text-[#C9A84C] transition-colors"
                        aria-label="Previous image"
                    >
                        &#8249;
                    </button>

                    <div
                        className="relative w-full max-w-5xl aspect-[4/3]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={active.url}
                            alt={active.alt}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                        {active.label && (
                            <p className="absolute -bottom-10 left-0 right-0 text-center text-white" style={{ fontSize: '0.95rem' }}>
                                {active.label}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            showNext();
                        }}
                        className="absolute right-2 sm:right-6 text-white text-4xl leading-none w-12 h-12 flex items-center justify-center hover:text-[#C9A84C] transition-colors"
                        aria-label="Next image"
                    >
                        &#8250;
                    </button>
                </div>
            )}
        </>
    );
}