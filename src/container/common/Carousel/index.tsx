"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from './index.module.scss'
import { ShowIf } from "@common/ShowIf";

type CarouselProps = {
    images: string[],
    size?: number,
    width?: string,
    height?: string,
    imageWidth?: number,
    imageHeight?: number,
    showDot?: boolean,
    radius?: number,
    autoPlay?: boolean,
    dotSize?: number
}

export const Carousel = ({
    images,
    width = '400px',
    height = '400px',
    imageWidth = 700,
    imageHeight = 700,
    showDot = true,
    radius = 10,
    autoPlay = true,
    dotSize = 20
}: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        if (!autoPlay) return
        const interval = setInterval(() => {
            if (images.length === 0) return
            if (current === images.length - 1) return setCurrent(0)
            setCurrent((current + 1) % images.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [current, images.length, autoPlay])
    return (
        <div className={styles.container} style={{
            width: width,
            height: height,
            borderRadius: radius,
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
            <ShowIf condition={showDot}>
                <div className={styles.buttons}>
                    {
                        images.map((_, index) => (
                            <button
                                className={index === current ? styles.active : styles.inactive}
                                key={index}
                                onClick={() => setCurrent(index)}
                                style={
                                    {
                                        width: dotSize,
                                        height: dotSize
                                    }
                                }
                            >
                            </button>
                        ))
                    }
                </div>
            </ShowIf >
        </div >
    );
}