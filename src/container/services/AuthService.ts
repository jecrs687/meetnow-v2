"use client";
import { getUser } from "@backend/repository/user";
import { ROUTES } from "@constants/ROUTES";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




export const AuthService = () => {
    const router = useRouter()
    useEffect(() => {
        getUser().then((user) => {
            if (!user.id) router.push(ROUTES.LOGIN())
        }).catch(() => {
            router.push(ROUTES.LOGIN())
        })
    }, [])
    return null;
}