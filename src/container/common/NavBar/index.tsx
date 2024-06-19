import { NAVBAR } from '@constants/NAV_BAR'
import styles from './index.module.scss'
import Link from 'next/link'
import colors from '@styles/modules/colors.module.scss'
export const NavBar = () => {
    return (
        <div className={styles.navbar}>
            {
                NAVBAR.map((item) => (
                    <Link
                        href={item.url}
                        key={item.url} className={styles.navbar_item}>
                        <item.icon size={25} />
                        <span>{item.label}</span>
                    </Link>
                ))
            }
        </div>
    )
}