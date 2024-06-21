import styles from './index.module.scss'
import Button from "@core/Button"
export const SuccessModal = ({
    isOpen,
    callback
}) => {
    return (

        <div className={styles.modal} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h1>Grupo criado </h1>
                </div>
                <div className={styles.modalBody}>
                    <p>Grupo criado com sucesso</p>
                </div>
                <div className={styles.modalFooter}>
                    <Button onClick={callback}>Ok</Button>
                </div>

            </div>

        </div>
    )
}