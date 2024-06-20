"use client";
import { FaArrowLeft } from 'react-icons/fa';
import styles from './index.module.scss'
import { useRouter } from "next/navigation";
export const BackButton = () => {
    const routes = useRouter()
    return (
        <div className={styles.back_button} onClick={() => routes.back()}>
            <FaArrowLeft size={18} color='black' />
        </div>
    )
}