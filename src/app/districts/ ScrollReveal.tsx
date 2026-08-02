'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number; // ms
    direction?: 'up' | 'left' | 'right';
}

export default function ScrollReveal({ children, delay = 0, direction = 'up' }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const offset = { up: 'translateY(24px)', left: 'translateX(-24px)', right: 'translateX(24px)' };

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translate(0,0)' : offset[direction],
                transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}