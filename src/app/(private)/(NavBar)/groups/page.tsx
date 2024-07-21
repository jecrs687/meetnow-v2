import { getGroupByUser } from "@backend/actions/group"
import TablesCards from "./_container/TableCard/TablesCards"
import dayjs from "dayjs"
import styles from './page.module.scss'
import Link from "next/link"
import { ROUTES } from "@constants/ROUTES"
export default async function Page() {
    const groups = await getGroupByUser()
    return <div
        className={styles.container}>
        <div className={styles.title}>
            <h1>Meus Grupos</h1>
        </div>
        <div className={styles.subtitle}>
            <h2>Grupos que você está participando</h2>
        </div>
        <div className={styles.cards}>
            {
                groups.map(group =>
                    <Link
                        key={group.id}
                        href={ROUTES.GROUP(group.id)} passHref>
                        <TablesCards
                            scheduledAt={dayjs(group.date).format('DD/MM/YYYY HH:mm')}
                            avatar="https://www.w3schools.com/howto/img_avatar.png"
                            description={group.description}
                            name={group.name}
                            max={group.number}
                            participants={group.participants.length}
                        />
                    </Link>
                )
            }
        </div>
    </div >
}