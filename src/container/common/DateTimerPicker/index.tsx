"use client";
import React from "react";
import { fromZonedTime, toDate, toZonedTime } from "date-fns-tz";
import DateFnsUtils from "@date-io/date-fns";
import dynamic from "next/dynamic";

const MuiPickersUtilsProvider = dynamic(() => import('@material-ui/pickers').then((x) => x.MuiPickersUtilsProvider),
    { ssr: false }) as any;
const DateTimePicker = dynamic(() => import('@material-ui/pickers').then(x => x.DateTimePicker) as any, { ssr: false }) as any;
const DatePicker = dynamic(() => import('@material-ui/pickers').then(x => x.DatePicker) as any, { ssr: false }) as any;
const TimePicker = dynamic(() => import('@material-ui/pickers').then(x => x.TimePicker) as any, { ssr: false }) as any;

const componentTypes = {
    datetime: DateTimePicker,
    date: DatePicker,
    time: TimePicker
};

const isoDateRegExp = /^(\d{1,})-?(\d{2})?-?(\d{2})T?(\d{2})?:?(\d{2})?:?(\d{2})?\.?(\d{3})?(Z|[+-]\d{2}:\d{2})?/;
const timeRegExp = /^(\d{2}):(\d{2}):?(\d{2})?\.?(\d{3})?/;

const getDateForPicker = (str, timezone) => {
    if (isoDateRegExp.test(str)) {
        return timezone ? toZonedTime(new Date(str), timezone) : toDate(str);
    } else if (timeRegExp.test(str)) {
        const date = new Date();
        const utcDateISOString = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        ).toISOString();
        return toDate(
            utcDateISOString.substring(0, utcDateISOString.indexOf("T") + 1) + str
        );
    }
    return null;
};


type FormikFieldDateTimePickerProps = {
    field: any,
    form: any,
    type: "datetime" | "date" | "time",
    timezone?: string,
    returnDateOnly?: boolean,
    [x: string]: any
};

const FormikFieldDateTimePicker = ({
    field,
    form,
    type = "datetime",
    timezone,
    returnDateOnly = false,
    ...restProps
}: FormikFieldDateTimePickerProps) => {
    const CustomTag = componentTypes[type];
    const currentError = form.errors[field.name];
    const pickerValue = getDateForPicker(field.value, timezone);
    console.log({ currentError })
    const handleChange = date => {
        if (date === null) {
            form.setFieldValue(field.name, null, true);
            return;
        }

        let storedValue;
        if (timezone) {
            storedValue = fromZonedTime(date, timezone).toISOString();
            storedValue = returnDateOnly
                ? storedValue.substring(0, storedValue.indexOf("T"))
                : storedValue;
        } else {
            const utcDateIsoString = new Date(
                Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds()
                )
            ).toISOString();

            if (isoDateRegExp.test(field.value)) {
                storedValue = !returnDateOnly
                    ? utcDateIsoString.substring(0, utcDateIsoString.indexOf("Z"))
                    : utcDateIsoString.substring(0, utcDateIsoString.indexOf("T"));
            } else {
                storedValue = utcDateIsoString.substring(
                    utcDateIsoString.indexOf("T") + 1,
                    utcDateIsoString.indexOf("Z")
                );
            }
        }
        form.setFieldValue(field.name, storedValue, true);
    };

    const handleBlur = e => {
        field.onBlur(e);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CustomTag
                name={field.name}
                value={pickerValue}
                helperText={currentError}
                error={Boolean(currentError)}
                onError={(_, error) => form.setFieldError(field.name, error)}
                onChange={handleChange}
                onBlur={handleBlur}
                {...restProps}
            />
        </MuiPickersUtilsProvider>
    );
};




export default FormikFieldDateTimePicker;
