import { AdvancedMarker, InfoWindow, Marker, Pin, useAdvancedMarkerRef, useMarkerRef } from "@vis.gl/react-google-maps";
import { useReducer, useState } from "react";
import { getPlaces } from "../../../../../../backend/actions/places";
import styles from './index.module.scss'
import Link from "next/link";
import { ROUTES } from "@constants/ROUTES";
import { FaArrowRight } from "react-icons/fa";
import { Carousel } from "@common/Carousel";
export const MarkerWithInfowindow = ({
    place: {
        address: {
            lat,
            lng
        },
        name,
        description,
        review,
        photos,
        id },
    setActive,
    currentActive,
    distance
}: {
    place: Awaited<ReturnType<typeof getPlaces>>[0],
    setActive: (id: string) => void,
    currentActive: string,
    distance: number
}
) => {
    const [infowindowOpen, setInfowindowOpen] = useReducer((x) => !x, false);
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                onClick={() => {
                    setInfowindowOpen();
                    setActive(id)
                }}
                position={{ lat, lng }}
                title={name}
            />
            <Pin
                background={'#0f9d58'}
                borderColor={'#006425'}
                glyphColor={'#60d98f'}
            />
            {(infowindowOpen &&
                currentActive === id
            ) && (
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
                            <p className={styles.distance}>{distance} km</p>
                            <Link href={ROUTES.PLACE(id)} className={styles.link}>
                                Ver <FaArrowRight />
                            </Link>
                        </div>
                    </InfoWindow>
                )}
        </>
    );
};