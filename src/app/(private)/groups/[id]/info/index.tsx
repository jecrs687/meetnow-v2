import { getGroup } from "@backend/repository/group"
import { BackButton } from "@common/BackButton"
import { ROUTES } from "@constants/ROUTES"
import Link from "next/link"
import styles from './page.module.scss'
import { getUser } from "@backend/repository/user"
import Image from "next/image"

export default async function Page({
    params: { id }
}) {
    const group = await getGroup(id);
    return (
        <div className={styles.container}>
            <BackButton />
            <div className={styles.group}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        {group.name}
                    </div>
                    <div className={styles.description}>
                        {group.description}
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    Participants
                </div>
                <div className={styles.participants}>
                    {
                        group.participants.map(participant =>
                            <div key={participant.id} className={styles.participant}>
                                <div className={styles.photos}>
                                    {
                                        participant.user.photos.map(photo =>
                                            <Image
                                                key={photo.id}
                                                src={photo.url}
                                                alt={participant.user.name}
                                                width={40}
                                                height={40}
                                                className={styles.photo}
                                            />)

                                    }
                                </div>
                                <div className={styles.name}>
                                    {participant.user.name}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.buttons}>
                    <Link
                        className={styles.button}
                        href={ROUTES.GROUP_PARTICIPANTS(id)}>
                        Participants
                    </Link>
                    <Link
                        className={styles.button}
                        href={ROUTES.GROUP_INVITES(id)}>
                        Invites
                    </Link>
                    <Link
                        className={styles.button}
                        href={ROUTES.GROUP_SETTINGS(id)}>
                        Settings
                    </Link>
                </div>
            </div>
        </div>)
}