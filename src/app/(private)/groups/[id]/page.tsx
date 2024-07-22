import { getGroup } from "@backend/repository/group"
import { BackButton } from "@common/BackButton"
import { ROUTES } from "@constants/ROUTES"
import Link from "next/link"
import styles from './page.module.scss'
import { getUser } from "@backend/repository/user"
import Image from "next/image"
import { Chat } from "./container/Chat"

export default async function Page({
    params: { id }
}) {
    const group = await getGroup(id);
    return (<Chat group={group} />)
}