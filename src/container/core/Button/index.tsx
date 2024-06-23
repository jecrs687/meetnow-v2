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
        ...props
    }: {
        children: React.ReactNode,
        onClick?: () => void,
        className?: string,
        variety?: 'primary' | 'secondary',
        disabled?: boolean,
        type?: 'button' | 'submit',
        href?: string,
        isLoading?: boolean

    } & React.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <button className={
            clsx(styles[variety], className)
        }
            onClick={onClick}
            type={type}
            {...props}
        >
            {isLoading && <LoaderSpinner size='20px' />}
            <span className={styles.text}>{children}</span>
        </button>
    )
}