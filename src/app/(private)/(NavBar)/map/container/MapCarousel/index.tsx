import { createRef, useEffect, useRef, useState } from "react";
import { getPlaces } from "../../../../../../backend/actions/places";
import styles from './index.module.scss';
import Link from "next/link";
import { ROUTES } from "@constants/ROUTES";
import { FaArrowRight } from "react-icons/fa";
import { Carousel } from "@common/Carousel";
import clsx from "clsx";
import { debounce } from "@material-ui/core";
import { Address } from "@prisma/client";
import { distanceCal } from "@utils/distanceCalc";
import { useGeoLocation } from "@store/useGeoLocation";


export const MapCarousel = ({
    places,
    selectActive,
    currentActive,
    userAddress
}: {
    places: Awaited<ReturnType<typeof getPlaces>>,
    selectActive: (id: string) => void,
    currentActive: string,
    userAddress: Address
}
) => {
    const {
        location
    } = useGeoLocation()
    const scrollRef = useRef<HTMLDivElement>()
    const [elRefs, setElRefs] = useState([]);
    const windowsSize = window.innerWidth
    const cardSize = elRefs[0]?.current?.clientWidth || 0
    const paddingSize = (windowsSize / 2) - (cardSize / 2)
    useEffect(() => {
        setElRefs((elRefs) =>
            Array.from({ length: places.length })
                .map((_, i) => elRefs[i] || createRef()),
        );
    }, [places.length]);
    useEffect(() => {
        if (!scrollRef.current) return;
        if (!cardSize) return;
        const current = scrollRef.current
        const handleScroll = debounce(() => {
            const scrollLeft = scrollRef.current.scrollLeft
            const index = Math.round(scrollLeft / (cardSize + 30))
            const left = index * (cardSize + 30)
            scrollRef.current.scroll(left, 0)
            selectActive(places[index].id)
        }, 200)
        current.addEventListener('scroll', handleScroll)
        return () => {
            current.removeEventListener('scroll', handleScroll)
        }
    }, [cardSize, places, scrollRef, selectActive, elRefs, paddingSize])
    useEffect(() => {
        if (!scrollRef.current) return
        const index = places.findIndex(place => place.id === currentActive)
        if (index === -1) return
        const left = index * (cardSize + 30)
        scrollRef.current.scroll(left, 0)
    }, [cardSize, currentActive, places])
    return (
        <div className={styles.container}
            ref={scrollRef}

        >
            <div
                className={styles.carousel}
                style={{
                    padding: `0px ${paddingSize}px`
                }}
            >
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
                                    showDot={true}
                                    autoPlay={false}
                                    dotSize={10}
                                    images={
                                        place.photos.map(photo => photo.url).filter(Boolean)
                                    } />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.name}>{place.name}</h3>
                                <p className={styles.description}>{place.description}</p>
                                <p className={styles.count}>
                                    {place._count.groups} grupos
                                </p>
                                <p className={styles.distance}>{distanceCal(location || userAddress, place.address).toFixed(2)} km</p>
                                <Link href={ROUTES.PLACE(place.id)} className={styles.link}>
                                    Ver <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};