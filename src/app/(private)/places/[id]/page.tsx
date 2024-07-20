import prisma from "@backend/configs/database"
import styles from './page.module.scss'
import { Carousel } from "@common/Carousel"
import { FaGripLines, FaPlus, FaRegUser, FaStar } from "react-icons/fa"
import Button from "@core/Button"
import { BackButton } from "@common/BackButton"
import Link from "next/link"
import { ROUTES } from "@constants/ROUTES"
import { getUser } from "@backend/repository/user"
export default async function Page({
    params: { id }
}) {
    const user = await getUser();
    const place = await prisma.place.findFirst({
        where: {
            id
        },
        include: {
            photos: true,
            _count: {
                select: {
                    groups: true
                }
            }
        }
    })

    if (!place) return <h1>
        Place not found
    </h1>

    return <div className={styles.container}>
        <BackButton />
        <div className={styles.place}>
            <div className={styles.photos}>
                <Carousel
                    width={'100%'}
                    height={'100%'}
                    images={place.photos.map(photo => photo.url)} />
            </div>
            <div className={styles.header}>
                <div className={styles.title}>
                    {place.name}
                </div>
                <div className={styles.review}>
                    {place.review}
                </div>
            </div>
            <div className={styles.body}>

                <div className={styles.title}>
                    <h3>
                        Sobre o {place.name}
                    </h3>
                    <h5>
                        <FaStar /> {place.review}
                    </h5>
                </div>
                <div className={styles.description}>
                    {place.description}
                </div>


            </div>
        </div>
        <div className={styles.footer}>
            <Link href={ROUTES.CREATE_GROUP(id)} className={styles.icon}>
                <FaPlus className={styles.icon_button} />
            </Link>
            <Link href={ROUTES.PLACE_GROUPS(id)} className={styles.button}>
                <Button >
                    Mesas ({place._count.groups})
                </Button>
            </Link>
            <Link href={ROUTES.CREATE_GROUP(id)} className={styles.icon}>

                <FaRegUser className={styles.icon_button} />
            </Link>
        </div>
    </div>

}