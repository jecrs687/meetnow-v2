"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from "react-dom";
import { submit } from './action';
import styles from './index.module.scss';
import { TOKEN_KEY } from '@utils/envs';
import Input from '@core/Input';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import { ROUTES } from '@constants/ROUTES';

function Submit() {
    const status = useFormStatus();
    return <Button disabled={status.pending} isLoading={status.pending} type='submit'>
        Entrar

    </Button>
}

export default function LoginPage() {
    const [state, formAction] = useFormState(submit, {})
    const route = useRouter()
    useEffect(() => {
        if (state.admin)
            localStorage.setItem('admin', state.admin)

        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token)
            route.push(ROUTES.HOME())
        }
    }, [state, route])
    return (
        <main className={styles.main}>
            <Image
                src="/assets/backgrounds/login.jpeg"
                alt="logo"
                width={1000}
                height={1000}
                className={styles.background}
            />
            <form action={formAction}>

                <div className={styles.logo}>
                    <Image
                        src="/assets/logo.png"
                        alt="logo"
                        width={200}
                        height={200}
                        className={styles.logo__image}
                    />


                </div>

                <Input
                    type='text'
                    placeholder='Email'
                    name="email"
                    title='Email'
                    error={state.errors?.email}
                />
                <Input
                    type='password'
                    placeholder='Senha'
                    name="password"
                    title='Senha'
                    error={state.errors?.password}
                />
                <Submit />

                <Link href={'/register'} className={styles.link}>
                    Não tem uma conta? Registre-se
                </Link>
            </form>
        </main>
    )
}
