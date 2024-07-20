"use client";
import { getPlaceWithUsersById } from "@backend/repository/place";
import styles from './index.module.scss'
import dayjs from "dayjs";
import { Carousel } from "@common/Carousel";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { ROUTES } from "@constants/ROUTES";
import Button from "@core/Button";
import { ParticipantStatus } from "@prisma/client";
import { requestParticipateAction } from "@actions/group";
import { useState } from "react";
import { ShowIf } from "@common/ShowIf";
import { STATUS_CONVERT } from "@constants/STATUS_CONVERT";
export const GroupCard =
    (
        {
            group, status: groupStatus, showStatus
        }: {
            group: Awaited<ReturnType<typeof getPlaceWithUsersById>>['groups'][0],
            status?: ParticipantStatus,
            showStatus?: boolean
        }
    ) => {
        const [isLoading, setIsLoading] = useState(false);
        const [status, setStatus] = useState(groupStatus);
        const convertMinutesToHours = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`
        }
        const handleParticipate = async () => {
            setIsLoading(true);
            const participant = await requestParticipateAction({
                id: group.id
            })
            setStatus(participant.status);
            setIsLoading(false);
        }
        const groupPhotos = group
            .participants
            .flatMap(participant => participant.user.photos)
            .map(photo => photo.url).filter(Boolean)
        const COLORS_BACK = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray']
        const CODE_BY_NAME = group.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return <div className={styles.container}>

            <div className={styles.carousel}
                style={{
                    backgroundColor: COLORS_BACK[Math.floor(CODE_BY_NAME % COLORS_BACK.length)]
                }}
            >{
                    !!groupPhotos.length &&
                    <Carousel
                        size={100}
                        height='100%'
                        width='100%'
                        showDot={false}
                        radius={40}
                        images={groupPhotos}
                    />
                }
            </div>

            <div className={styles.content}>
                <div className={styles.title}>
                    <h1 className={styles.name}>
                        {group.name}
                    </h1>
                    <p className={styles.description}>
                        {group.description}
                    </p>
                </div>
                <div className={styles.participants}>
                    <h5>
                        {
                            group.participants.map(participant => participant.user.name).join(", ")
                        }
                    </h5>
                </div>
                <div className={styles.information}>
                    <div className={styles.duration}>
                        <h5>
                            {dayjs(group.date).format('DD/MM/YYYY')}
                        </h5>
                        <h3>
                            {
                                convertMinutesToHours(group.duration)
                            }
                        </h3>
                    </div>
                    <ShowIf condition={showStatus}>
                        {
                            ParticipantStatus.ACCEPTED === status ?
                                <Link href={ROUTES.GROUP(group.id)}
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <Button variety="primary"

                                    >
                                        Entrar
                                    </Button>
                                </Link> :
                                <Button variety="secondary"
                                    isLoading={
                                        isLoading
                                    } onClick={handleParticipate}>
                                    {
                                        STATUS_CONVERT[status] || "Solicitar"
                                    }
                                </Button>
                        }
                    </ShowIf>
                    <div className={styles.footer}>
                        <FaUser />

                        <h5>
                            {group.participants.length}/{group.number}
                        </h5>
                    </div>



                </div>
            </div>

        </div>
    };