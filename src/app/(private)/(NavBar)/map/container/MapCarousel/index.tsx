import { createRef, useEffect, useRef, useState } from "react";
import { getPlaces } from "../../actions";
import styles from './index.module.scss';
import Link from "next/link";
import { ROUTES } from "@constants/ROUTES";
import { FaArrowRight } from "react-icons/fa";
import { Carousel } from "@common/Carousel";
import clsx from "clsx";
import { debounce } from "@material-ui/core";


export const MapCarousel = ({
    places,
    selectActive,
    currentActive
}: {
    places: Awaited<ReturnType<typeof getPlaces>>,
    selectActive: (id: string) => void,
    currentActive: string
}
) => {
    const scrollRef = useRef<HTMLDivElement>()
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        setElRefs((elRefs) =>
            Array.from({ length: places.length })
                .map((_, i) => elRefs[i] || createRef()),
        );
    }, [places.length]);
    useEffect(() => {
        if (currentActive) {
            const el = elRefs.find(ref => ref.current.id === currentActive)
            if (el) {
                scrollRef.current.scrollTo({
                    left: el.current.offsetLeft - window.innerWidth / 2 + el.current.offsetWidth / 2,
                    behavior: 'smooth'
                })
            }
        }
    }, [currentActive, elRefs])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
            })
            const scrollTo = debounce(
                (id) => {
                    const el = elRefs.find(ref => ref.current.id === id)
                    if (el)
                        scrollRef.current.scrollTo({
                            left: el.current.offsetLeft - (window.innerWidth / 2 + el.current.offsetWidth / 2),
                            behavior: 'smooth'
                        })

                }, 100
            )
            scrollRef.current.addEventListener('scroll', scrollTo)
            return () => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                scrollRef.current.removeEventListener('scroll', scrollTo)
            }
        }
    }, [scrollRef, elRefs, selectActive])

    return (<div className={styles.carousel} ref={scrollRef}>
        {
            places.map((place, i) => (
                <div
                    key={place.id}
                    ref={elRefs[i]}
                    onClick={() => selectActive(place.id)}
                    className={
                        clsx(styles.item, {
                            [styles.active]: place.id === currentActive
                        })
                    }
                >
                    <div className={styles.image}>
                        <Carousel
                            height="200px"
                            width="300px"
                            showDot={false}
                            images={
                                place.photos.map(photo => photo.url).filter(Boolean)
                            } />
                    </div>

                    <div className={styles.content}>
                        <h3 className={styles.name}>{place.name}</h3>
                        <p className={styles.description}>{place.description}</p>
                        <Link href={ROUTES.PLACE(place.id)} className={styles.link}>
                            Ver <FaArrowRight />
                        </Link>
                    </div>
                </div>
            ))
        }
    </div>

    );
};