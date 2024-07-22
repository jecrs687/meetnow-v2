"use client";
import { FaArrowLeft } from 'react-icons/fa';
import styles from './index.module.scss'
import { useRouter } from "next/navigation";
import clsx from 'clsx';
export const BackButton = ({ className }: {
    className?: string
}) => {
    const routes = useRouter()
    return (
        <div className={
            clsx(styles.back_button, {
                [className]: !!className
            })
        } onClick={() => routes.back()}>
            <FaArrowLeft size={18} color='black' />
        </div>
    )
}