import prisma from "@backend/configs/database"
import { BackButton } from "@common/BackButton"
import { ROUTES } from "@constants/ROUTES"
import Link from "next/link"

export default async function Page({
    params: { id }
}) {
    const group = await prisma.group.findUnique({
        where: {
            id
        }
    })
    return (
        <div style={{
            flex: 1,

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px'
        }}>
            <BackButton />
            {group.name}
            <Link href={ROUTES.GROUP_PARTICIPANTS(id)}>
                Participants
            </Link>
            <Link href={ROUTES.GROUP_INVITES(id)}>
                Invites
            </Link>
            <Link href={ROUTES.GROUP_SETTINGS(id)}>
                Settings
            </Link>


        </div>
    )
}