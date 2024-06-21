import { getPlaceWithUsersById } from "@backend/repository/place";
import styles from './index.module.scss'
import dayjs from "dayjs";
import { Carousel } from "@common/Carousel";
import { FaUser } from "react-icons/fa";
export const GroupCard =
    (
        {
            group
        }: {
            group: Awaited<ReturnType<typeof getPlaceWithUsersById>>['groups'][0]
        }
    ) => {
        const convertMinutesToHours = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`
        }
        return <div className={styles.container}>
            <div className={styles.carousel}>
                <Carousel
                    size={100}
                    height="80px"
                    width="80px"
                    showDot={false}
                    radius={40}
                    images={
                        group
                            .participants
                            .flatMap(participant => participant.user.photos)
                            .map(photo => photo.url).filter(Boolean)

                    } />
            </div>

            <div className={styles.content}>
                <div className={styles.title}>
                    <h3 className={styles.name}>
                        {group.name}
                    </h3>
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
                <div className={styles.footer}>
                    <FaUser />

                    <h5>
                        {group.participants.length}/{group.number}
                    </h5>
                </div>

            </div>
        </div>
    };