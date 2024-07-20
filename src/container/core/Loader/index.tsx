import LoaderSpinner from '@core/LoaderSpinner'
import styles from './index.module.scss'



export const Loader = () => {
    return <div className={styles.container}>
        <LoaderSpinner />
    </div>
}