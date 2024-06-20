"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from './index.module.scss'

type CarouselProps = {
    images: string[],
    size?: number,
    width?: string,
    height?: string,
    imageWidth?: number,
    imageHeight?: number,
}

export const Carousel = ({
    images,
    width = '400px',
    height = '400px',
    imageWidth = 700,
    imageHeight = 700
}: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (images.length === 0) return
            if (current === images.length - 1) return setCurrent(0)
            setCurrent((current + 1) % images.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [current, images.length])
    return (
        <div className={styles.container} style={{
            width: width,
            height: height,
        }}>
            <div className={styles.carousel}>
                <Image
                    src={images[current]}
                    alt={images[current]}
                    width={imageWidth}
                    height={imageHeight}
                    className={styles.image}
                />
            </div>
            <div className={styles.buttons}>
                {
                    images.map((_, index) => (
                        <button
                            className={index === current ? styles.active : styles.inactive}
                            key={index}
                            onClick={() => setCurrent(index)}
                        >
                        </button>
                    ))
                }
            </div>
        </div>
    );
}