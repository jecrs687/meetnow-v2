"use client";
import styles from './page.module.scss'
import { FaPlus } from "react-icons/fa"
import { BackButton } from "@common/BackButton"
import Link from "next/link"
import { ROUTES } from "@constants/ROUTES"
import { getPlaceWithUsersById } from "@backend/repository/place"
import { GroupCard } from "@common/GroupCard"
import { COLORS } from "@styles/modules"
import { getUser } from "@backend/repository/user"
import { useCallback, useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card'
import LoaderSpinner from '@core/LoaderSpinner';
import { declineParticipateAction, requestParticipateAction } from '@backend/actions/group';

export default function Page({
    params: { id }
}) {
    const [loading, setLoading] = useState(true)
    const [place, setPlace] = useState<
        Awaited<ReturnType<typeof getPlaceWithUsersById>>
    >(null)
    const [groups, setGroups] = useState<
        Awaited<ReturnType<typeof getPlaceWithUsersById>>['groups']
    >(null)
    const [user, setUser] = useState<
        Awaited<ReturnType<typeof getUser>>
    >(null)
    const getData = useCallback(async () => {
        setLoading(true)
        const [user, place] = await Promise.all([
            getUser(),
            getPlaceWithUsersById(id)
        ])
        setPlace(place)
        setGroups(place.groups)
        setUser(user)
        setLoading(false)
    }, [id])
    useEffect(() => {
        getData()
    }, [getData])
    if (loading) return <div
        style={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%'
            }
        }>
        <LoaderSpinner />
    </div>
    const handleSwipe = (id: string) => (direction: 'left' | 'right') => {
        setGroups(groups.filter(group => group.id !== id))
        if (direction === 'right') {
            declineParticipateAction({ id })
        } else {
            requestParticipateAction({ id })
        }
    }
    return <div className={styles.container}>
        <BackButton />
        <div className={styles.place}>
            <div className={styles.body}>
                <div className={styles.groups}>
                    {
                        groups
                            .map(
                                (group, i) => (
                                    <div
                                        key={group.id}
                                        className={styles.swipe}
                                        style={{ zIndex: i }}
                                    >
                                        <TinderCard
                                            onSwipe={handleSwipe(group.id)}
                                        >
                                            <GroupCard group={group} key={group.id} />
                                        </TinderCard>
                                    </div>
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