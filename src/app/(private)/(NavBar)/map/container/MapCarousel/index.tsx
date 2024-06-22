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