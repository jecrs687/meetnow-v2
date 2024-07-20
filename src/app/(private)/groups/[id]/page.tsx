import { getGroup } from "@backend/repository/group"
import { BackButton } from "@common/BackButton"
import { ROUTES } from "@constants/ROUTES"
import Link from "next/link"
import styles from './page.module.scss'
import { getUser } from "@backend/repository/user"

export default async function Page({
    params: { id }
}) {
    const group = await getGroup(id);
    return (<div className={styles.container}>
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

        <Link href={ROUTES.GROUP_PARTICIPANTS(id)}>
            Participants
        </Link>
        <Link href={ROUTES.GROUP_INVITES(id)}>
            Invites
        </Link>
        <Link href={ROUTES.GROUP_SETTINGS(id)}>
            Settings
        </Link>
    </div>)
}