"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submit } from './action';
import styles from './index.module.scss';
import { ROUTES } from '@constants/ROUTES';
import { TOKEN_KEY } from '@utils/envs';
import { setCookie } from '@utils/cookie';
import { ShowIf } from '@common/ShowIf';
import Input from '@core/Input';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
function Submit() {
    const status = useFormStatus();
    return <Button disabled={status.pending} type='submit'>
        {
            status.pending ? <LoaderSpinner /> : 'Cadastrar'
        }
    </Button>
}

export default function Register() {
    const [state, formAction] = useFormState(submit, {})
    const route = useRouter()
    const ref = useRef();
    const [steps, setSteps] = useState(1)
    const [values, setValues] = useState({})
    const [modalError, setModalError] = useState(false)
    const [alreadyNavigate, setAlreadyNavigate] = useState(1)
    const stepsErrors = useMemo(() => [
        ['email', 'password', 'passwordConfirmation'],
        ['name', 'bio']
    ], [])
    const errorsByStep = Object
        .entries(stepsErrors)
        .reduce((acc, [key, value]) => {
            value.forEach(v => {
                acc[v] = +key
            })
            return acc;
        }, {})
    useEffect(() => {
        if (state.success) {
            route.push(ROUTES.OTP(state.user.id))
        }
        if (state.error) {
            setModalError(true)
        }
        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token)
            setCookie(TOKEN_KEY, state.token)
            route.push(ROUTES.DASHBOARD())
        }
        if (state.errors) {
            for (const key in stepsErrors) {
                if (stepsErrors[key].some(key => state.errors[key])) {
                    setSteps(Number(key) + 1)
                    break;
                }
            }
        }
    }, [state, route, stepsErrors])
    useEffect(() => {
        state.errors = {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values])
    const inputHandle = (name) => {
        const findError = errorsByStep[name]
        return {
            error: findError < alreadyNavigate ? state.errors?.[name] : '',
            name,
            value: values[name],
            onChange: (e) => setValues({ ...values, [name]: e.target.value })
        }
    }
    return (<>

        <main className={styles.main}>

            <div
                style={{
                    display: modalError ? 'block' : 'none'
                }}
                onClick={() => setModalError(false)}

            >

                <div>
                    {state.error}
                </div>
                <button onClick={() => setModalError(false)}>
                    Ok
                </button>
            </div>
            <form action={formAction} ref={ref}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Image
                        src={"/assets/logo.png"}
                        width={150}
                        height={150}
                        alt='logo'
                        className={styles.image}
                    />
                </div>
                <div className={styles.form}>
                    <ShowIf condition={steps === 1} onlyHide>
                        <Input
                            placeholder='Email'
                            title='Email'
                            type='text'
                            {...inputHandle('email')}
                        />
                        <Input
                            placeholder='Senha'
                            title='Senha'
                            type='password'
                            {...inputHandle('password')}
                        />
                        <Input
                            placeholder='Confirmação de senha'
                            title='Confirmação de senha'
                            type='password'
                            {...inputHandle('passwordConfirmation')}
                        />
                    </ShowIf>
                    <ShowIf condition={steps === 2} onlyHide>
                        <Input
                            placeholder='Nome'
                            title='Nome'
                            type='text'
                            {...inputHandle('name')}
                        />
                        <Input
                            placeholder='Bio'
                            title='bio'
                            type='text'
                            textarea={true}
                            {...inputHandle('bio')}
                        />
                    </ShowIf>

                    <ShowIf condition={steps === 3} >
                        <LoaderSpinner />
                    </ShowIf>

                </div>
                <div className={styles.buttons}>
                    <ShowIf condition={steps > 1} onlyHide>
                        <Button
                            onClick={() => setSteps(steps - 1)}

                            type='button'
                        >
                            Anterior
                        </Button>
                    </ShowIf>
                    <ShowIf condition={steps > 1} onlyHide>
                        <Submit />
                    </ShowIf>
                    <ShowIf condition={steps < 2} onlyHide>
                        <Button
                            type="submit"
                            onClick={() => {
                                setSteps(steps + 1);
                                if (steps !== 1) setAlreadyNavigate(x => x + 1)
                            }
                            }
                        >
                            Próximo
                        </Button>
                    </ShowIf>
                </div>

                <Link href={ROUTES.LOGIN()}
                    className={styles.link}>
                    Tem uma conta? Faça login
                </Link>
            </form>

        </main></>

    )
}

