import prisma from "@backend/configs/database"
import styles from './page.module.scss'
import Image from "next/image"
import { firstLetterUpper } from "@utils/firstLetterUpper"
import { Carousel } from "@common/Carousel"
import { validateToken } from "@utils/token"
import { cookies } from "next/headers"
import { TOKEN_KEY } from "@utils/envs"
import { FaGripLines, FaPlus, FaRegUser, FaStar } from "react-icons/fa"
import Button from "@core/Button"
import { BackButton } from "@common/BackButton"
import Link from "next/link"
import { ROUTES } from "@constants/ROUTES"
import Input from "@core/Input"
import { getPlaceWithUsersById } from "@backend/repository/place"
import { GroupCard } from "./container/GroupCard"
import { COLORS } from "@styles/modules"
export default async function Page({
    params: { id }
}) {
    const { decoded } = validateToken(cookies().get(TOKEN_KEY).value)
    const user = await prisma.user.findFirst({
        where: {
            id: decoded.id
        }
    });
    const place = await getPlaceWithUsersById(id)

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
                    Grupos
                </div>
            </div>
            <div className={styles.body}>


                <div className={styles.groups}>
                    {
                        place.groups.map(
                            (group) => (
                                <GroupCard group={group} key={group.id} />
                            )
                        )
                    }
                </div>


            </div>
        </div>
        <div className={styles.footer}>
            <Link href={ROUTES.CREATE_GROUP(id)} >
                <FaPlus className={styles.icon} color={COLORS.initial} />
            </Link>
        </div>
    </div>

}