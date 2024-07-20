import clsx from 'clsx'
import styles from './index.module.scss'
import LoaderSpinner from '@core/LoaderSpinner'


export default function Button(
    {
        children,
        className,
        variety = 'primary',
        onClick,
        type = 'button',
        isLoading,
        status = 'default',
        ...props
    }: {
        children: React.ReactNode,
        onClick?: () => void,
        className?: string,
        variety?: 'primary' | 'secondary' | 'tertiary' | 'quaternary',
        status?: 'pending' | 'success' | 'error' | 'warning' | 'info' | 'default',
        disabled?: boolean,
        type?: 'button' | 'submit',
        href?: string,
        isLoading?: boolean

    } & React.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <button className={
            clsx(styles[variety], className, styles[status])
        }
            onClick={onClick}
            type={type}

            {...props}
            disabled={
                isLoading || props.disabled
            }
        >
            {isLoading ?
                <div
                    className={styles.loader}
                ><LoaderSpinner size='20px' /> </div> :
                <span className={styles.text}>{children}</span>
            }
        </button>
    )
}