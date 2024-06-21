import { getPlaceWithUsersById } from "@backend/repository/place";
import styles from './index.module.scss'
import dayjs from "dayjs";
import { Carousel } from "@common/Carousel";
export const GroupCard =
    (
        {
            group
        }: {
            group: Awaited<ReturnType<typeof getPlaceWithUsersById>>['groups'][0]
        }
    ) => {
        return <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h3>
                        {group.name}
                    </h3>
                    <p>
                        {group.description}
                    </p>
                </div>
                <div className={styles.duration}>
                    <h5>
                        {dayjs(group.date).format('DD/MM/YYYY')}
                    </h5>
                    <h5>
                        {group.duration}
                    </h5>
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.footer}>
                    <h5>
                        {group.participants.length}
                    </h5>
                    <h5>
                        {group.number}
                    </h5>
                </div>
                <div className={styles.participants}>
                    <h5>
                        {
                            group.participants.map(participant => participant.user.name).join(", ")
                        }
                    </h5>
                    <Carousel
                        size={60}
                        height="60%"
                        width="100%"
                        images={
                            group
                                .participants
                                .flatMap(participant => participant.user.photos)
                                .map(photo => photo.url).filter(Boolean)

                        } />

                </div>
            </div>
        </div>
    };