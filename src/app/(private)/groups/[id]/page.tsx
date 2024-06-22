import prisma from "@backend/configs/database"

export default async function Page({
    params: { id }
}) {
    const group = await prisma.group.findUnique({
        where: {
            id
        }
    })
    return (
        <div>
            {group.name}
        </div>
    )
}