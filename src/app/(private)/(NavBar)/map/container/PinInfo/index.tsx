import { AdvancedMarker, InfoWindow, Marker, Pin, useAdvancedMarkerRef, useMarkerRef } from "@vis.gl/react-google-maps";
import { useReducer, useState } from "react";
import { getPlaces } from "../../actions";
import styles from './index.module.scss'
import Link from "next/link";
import { ROUTES } from "@constants/ROUTES";
import { FaArrowRight } from "react-icons/fa";
import { Carousel } from "@common/Carousel";
export const MarkerWithInfowindow = ({
    address: {
        lat,
        lng
    },
    name,
    description,
    review,
    photos,
    id
}: Awaited<ReturnType<typeof getPlaces>>[0]
) => {
    const [infowindowOpen, setInfowindowOpen] = useReducer((x) => !x, false);
    const [markerRef, marker] = useMarkerRef();

    return (
        <>
            <Marker
                ref={markerRef}
                onClick={() => setInfowindowOpen()}
                position={{ lat, lng }}
                title={name}
            />
            <Pin background={'#22ccff'} borderColor={'#1e89a1'} scale={1.4}>
                👀
            </Pin>
            {infowindowOpen && (
                <InfoWindow
                    anchor={marker}
                    maxWidth={300}
                    onCloseClick={() => setInfowindowOpen()}>
                    <div className={styles.infowindow}>
                        <div className={styles.carousel}>
                            <Carousel
                                height="150px"
                                width="250px"
                                showDot={false}
                                images={
                                    photos.map(photo => photo.url).filter(Boolean)
                                } />
                        </div>
                        <h3 className={styles.name}>{name}</h3>
                        <p className={styles.description}>{description}</p>
                        <Link href={ROUTES.PLACE(id)} className={styles.link}>
                            Ver <FaArrowRight />
                        </Link>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};