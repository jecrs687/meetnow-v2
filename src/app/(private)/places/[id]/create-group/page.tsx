import prisma from "@backend/configs/database"
import styles from './page.module.scss'
import { Carousel } from "@common/Carousel"
import { validateToken } from "@utils/token"
import { cookies } from "next/headers"
import { TOKEN_KEY } from "@utils/envs"
import { FaGripLines, FaRegUser } from "react-icons/fa"
import Button from "@core/Button"
import { BackButton } from "@common/BackButton"
import Link from "next/link"
import { ROUTES } from "@constants/ROUTES"
import { GroupCreationForm } from "./container/Form"
import { getUser } from "@backend/repository/user"
export default async function Page({
    params: { id }
}) {
    const user = getUser();
    const place = await prisma.place.findFirst({
        where: {
            id
        },
        include: {
            photos: true
        }
    })

    if (!place) return <h1>
        Place not found
    </h1>

    return <div className={styles.container}>
        <BackButton />
        <div className={styles.place}>
            <div className={styles.photos}>
                <Carousel height={'300px'} width="100%" images={place.photos.map(photo => photo.url)} />
            </div>
            <div className={styles.header}>
                <div className={styles.title}>
                    {place.name}
                </div>
                <div className={styles.review}>

                </div>
            </div>
            <div className={styles.body}>
                <GroupCreationForm id={id} />
            </div>
        </div>
    </div>

}