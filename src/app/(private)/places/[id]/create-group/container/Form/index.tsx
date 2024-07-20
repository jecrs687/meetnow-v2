"use client"
import Input from "@core/Input";
import styles from "./index.module.scss";
import Button from "@core/Button";
import { useFormState } from "react-dom";
import { Field, Form, Formik } from "formik";
import { onSubmit } from "./action";
import * as z from "zod";
import FormikFieldDateTimePicker from "@common/DateTimerPicker";
import { TimePicker } from "@common/TimePicker";
import { SelectField } from "@common/SelectField";
import { SuccessModal } from "../SuccessModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@constants/ROUTES";
import LoaderSpinner from "@core/LoaderSpinner";
import { ShowIf } from "@common/ShowIf";

const ValidationSchema = z.object(
    {
        name: z.string().min(3).max(255),
        description: z.string().min(3).max(255),
        quantity: z.number().min(1).max(10),
        date: z.string(),
        time: z.date(),
        duration: z.number().min(30).max(240)
    }
);

export type FormValues = z.infer<typeof ValidationSchema>;

export function GroupCreationForm({
    id
}) {

    const [modalSuccess, setModalSuccess] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>()
    const [step, setStep] = useState(0)
    const router = useRouter();

    const submit = async (values) => {
        try {
            setIsLoading(true)
            const response = await onSubmit({ ...values, placeId: id })
            setModalSuccess(response.id)
            setIsLoading(false)
        } catch {
            console.log("error")

        }
    }
    if (isLoading) <LoaderSpinner />
    return <>
        <SuccessModal
            isOpen={modalSuccess}
            callback={() => {
                setIsLoading(true)
                const route = ROUTES.GROUP(modalSuccess)
                router.push(route)
            }
            }
        />
        <Formik<FormValues>
            initialValues={{
                name: '',
                description: '',
                quantity: 0,
                date: null,
                time: new Date(),
                duration: 30
            }}
            validate={(e: FormValues) => {
                try {
                    ValidationSchema.parse(e);
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        return error.formErrors.fieldErrors;
                    }
                }
            }}
            onSubmit={submit}
        >
            <Form className={styles.form}>
                <ShowIf onlyHide condition={step === 0}>
                    <h3 className={styles.step_title}>
                        Informações do evento
                    </h3>
                    <Field
                        name="date"
                        component={FormikFieldDateTimePicker}
                        inputVariant="outlined"
                        label="Data do evento"
                        type="date"
                        format="dd/MM/yyyy"
                        helperText=""
                        clearable
                        className={styles.timePicker}
                    />

                    <br />
                    <TimePicker
                        name="time"
                        label="Hora do evento"
                        className={styles.timePicker}
                    />
                    <br />
                    <Field
                        component={SelectField}
                        label="Duração do evento"
                        name="duration"
                        options={[
                            { value: 30, label: "30 minutos" },
                            { value: 60, label: "1 hora" },
                            { value: 90, label: "1 hora e meia" },
                            { value: 120, label: "2 horas" },
                            { value: 150, label: "2 horas e meia" },
                            { value: 180, label: "3 horas" },
                            { value: 210, label: "3 horas e meia" },
                            { value: 240, label: "4 horas" },
                        ]}
                    />
                </ShowIf>

                <ShowIf onlyHide condition={step === 1}>
                    <h3 className={styles.step_title}>
                        Informações da mesa
                    </h3>
                    <Field
                        name="name"
                        title="Nome da mesa"
                        placeholder="Nome da mesa"
                        component={Input}
                    />
                    <Field
                        name="description"
                        title="Descrição"
                        placeholder="Descrição"
                        component={Input}
                    />
                    <Field
                        name="quantity"
                        type="number"
                        title="Quantidade de pessoas"
                        placeholder="Quantidade de pessoas"
                        component={Input}
                    />
                </ShowIf>

                <Button
                    className={styles.button}
                    type={step != 1 ? 'button' : 'submit'}
                    onClick={() => setStep(step + 1)}
                >
                    {step != 1 ? 'Próximo' : 'Criar mesa'}
                </Button>
            </Form>
        </Formik>
    </>

}