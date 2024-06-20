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

const ValidationSchema = z.object(
    {
        name: z.string().min(3).max(255),
        description: z.string().min(3).max(255),
        quantity: z.number().min(1).max(10)
    }
);

export type FormValues = z.infer<typeof ValidationSchema>;

export function GroupCreationForm({
    id
}) {

    return <Formik<FormValues>
        initialValues={{
            name: '',
            description: '',
            quantity: 0
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
        onSubmit={(values) => {
            onSubmit({ ...values, placeId: id })
        }}
    >
        <Form className={styles.form}>

            <Field
                name="staticDateTimeLinked"
                component={FormikFieldDateTimePicker}
                inputVariant="outlined"
                label="Data do evento"
                type="date"
                format="MM/dd/yyyy"
                helperText=""
                clearable
                className={styles.timePicker}
            />
            <br />
            <TimePicker
                name="staticDateTimeLinked"
                label="Hora do evento"
                className={styles.timePicker}
            />
            <br />

            <Field
                component={SelectField}
                label="Duração do evento"
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
            <Button type="submit">
                Criar mesa
            </Button>
        </Form>
    </Formik>

}