import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from './carousel';

export interface GalleryImage {
    url: string;
    label?: string;
    alt: string;
}

interface ImageCarouselProps {
    images: GalleryImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    if (!images?.length) return null;

    return (
        <div className="mb-16">
            <Carousel opts={{ loop: true }} className="max-w-4xl mx-auto">
                <CarouselContent>
                    {images.map((image, idx) => (
                        <CarouselItem key={idx}>
                            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                                {image.label && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A1F44]/90 to-transparent px-6 py-4">
                                        <p className="text-white" style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.125rem',
                                            fontWeight: 600
                                        }}>
                                            {image.label}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    );
}