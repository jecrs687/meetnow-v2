import { BackButton } from "@common/BackButton"
import styles from './index.module.scss'
import { getGroup } from "@backend/repository/group"
import { MdSettings } from "react-icons/md"
import { useRouter } from "next/navigation"
import { ROUTES } from "@constants/ROUTES"


type ChatHeader = {
    group: Awaited<ReturnType<typeof getGroup>>
}

export const ChatHeader = ({
    group
}: ChatHeader) => {
    const route = useRouter()
    return <div className={styles.container}>
        <BackButton className={styles.back_button} />
        <div className={styles.title}>
            {group.name}
        </div>
        <div className={styles.settings}>
            <div className={styles.settings_button}>
                <MdSettings onClick={() => {
                    route.push(ROUTES.GROUP_SETTINGS(group.id))
                }} />
            </div>
        </div>
    </div>
}