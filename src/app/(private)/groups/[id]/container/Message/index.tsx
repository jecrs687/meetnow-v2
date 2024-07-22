import { getMessagesAction } from '@backend/actions/chat'
import styles from './index.module.scss'
import dayjs from 'dayjs'
import { getUserId } from '@backend/utils/getUserId'
import { storeRequest } from '@utils/storeRequest'
import { getCookie } from '@utils/cookie'
import { TOKEN_KEY } from '@utils/envs'
import { validateToken } from '@utils/token'
import clsx from 'clsx'
import Image from 'next/image'
import { MediaDecode } from '../MediaDecode'
import { ShowIf } from '@common/ShowIf'



export const Message = (
    message: Awaited<ReturnType<typeof getMessagesAction>>[0],
    index: number
) => {
    const isOwner = validateToken(getCookie(TOKEN_KEY)).decoded.id == message.id
    return (
        <div className={
            clsx(
                styles.message, {
                [styles.owner]: isOwner
            }
            )
        } key={index}>
            <div className={styles.content}>
                <div className={styles.medias}>
                    {message?.medias?.map(MediaDecode)}
                </div>
                <ShowIf condition={!!message.text}>
                    <div className={styles.text}>
                        {message.text}
                    </div>
                </ShowIf>
                <div className={styles.date}>
                    {dayjs(message.createdAt).format('HH:mm')}
                </div>
            </div>
        </div>
    )
}