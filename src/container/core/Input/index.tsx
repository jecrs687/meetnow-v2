'use client'
import { zoomOutMobile } from '@utils/zoomOut'
import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'

function Input({
    label,
    placeholder,
    type = 'text',
    title,
    name,
    error,
    value,
    textarea = false,
    onChange,
    color = 'white',
    className,
    onFocus,
    onBlur,
    disabled,
    field,
    form,
    ...rest
}: {
    label?: string,
    placeholder?: string,
    type?: 'text' | 'password' | 'phone' | 'email' | 'number',
    name: string,
    error?: string,
    value?: string,
    textarea?: boolean,
    onChange?: (e: any) => void,
    color?: 'white' | 'black',
    className?: string,
    onFocus?: (e: any) => void,
    onBlur?: (e: any) => void,
    title: string,
    disabled?: boolean,
    field?: any,
    form?: any,
    [x: string]: any
}) {
    onChange = onChange || field?.onChange
    name = name || field?.name
    value = value || field?.value
    error = error || (form?.touched?.[name] ||
        form?.submitCount > 0
        ? form?.errors?.[name] : undefined
    )
    const [hide, setHide] = useState(true)
    const toggleHide = () => setHide(!hide)
    const typePassword = hide ? 'password' : 'text'
    const [current, setCurrent] = useState(value || field?.value);
    useEffect(() => {
        setCurrent(value)
    }, [value])
    const updateValue = (e: any) => {

        if (type === 'phone') {
            e.target.value = e.target.value.replace(/\D/g, '');
            e.target.value = e.target.value.slice(0, 30);
            if (e.target.value.length > 10)
                e.target.value = e.target.value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            else if (e.target.value.length > 6)
                e.target.value = e.target.value.replace(/^(\d{2})(\d{4})(\d{1})/, '($1) $2-$3');
            else if (e.target.value.length > 2)
                e.target.value = e.target.value.replace(/^(\d{2})(\d{1})/, '($1) $2');
            else if (e.target.value.length > 0)
                e.target.value = e.target.value.replace(/^(\d{1})/, '($1');
            setCurrent(e.target.value);
            e.target.value = e.target.value.replace(/\D/g, '');
            onChange?.(e);

        } else {
            setCurrent(e.target.value);
            onChange?.(e);
        }
    }
    const inputProps = {
        type: type === 'password' ? typePassword : type,
        name: name,
        id: name,
        placeholder,
        onFocus,
        disabled,
        onBlur,
        ...field,
        className: clsx(styles.input, className, field?.className),
        value: current,
        onChange: updateValue,
    }
    return (
        <>
            <div className={clsx(styles.container, styles[color])}>
                <label htmlFor={name}>{label || title || name}</label>
                {textarea ? <textarea {...inputProps} /> : <input {...inputProps}
                    onFocus={() => { zoomOutMobile() }}
                    onBlur={() => { zoomOutMobile() }}
                />}
                {type === 'password' && (
                    <div className={styles.eye} onClick={toggleHide}>
                        <Image
                            src={`/assets/icons/${hide ? 'eye' : 'closed_eye'}.svg`}
                            alt="eye"
                            priority={true}
                            width={20}
                            height={20}
                        />
                    </div>
                )}
                {error && <span className={styles.error}>{
                    Array.isArray(error) ? error.join('. ') : error
                }</span>}

            </div>
        </>
    )
}


export default Input
