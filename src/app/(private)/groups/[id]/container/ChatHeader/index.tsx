import { BackButton } from "@common/BackButton"
import styles from './index.module.scss'
import { getGroup } from "@backend/repository/group"


type ChatHeader = {
    group: Awaited<ReturnType<typeof getGroup>>
}

export const ChatHeader = ({
    group
}: ChatHeader) => {
    return <div className={styles.container}>
        <BackButton className={styles.back_button} />
        <div className={styles.title}>
            {group.name}
        </div>
    </div>
}