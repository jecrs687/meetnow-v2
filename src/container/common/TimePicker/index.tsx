"use client";
import dynamic from 'next/dynamic';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker as TPicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
// const AdapterDayjs = dynamic(() => import('@mui/x-date-pickers/AdapterDayjs').then(x => x.AdapterDayjs) as any, { ssr: false }) as any;
// const LocalizationProvider = dynamic(() => import('@mui/x-date-pickers/LocalizationProvider').then(x => x.LocalizationProvider) as any, { ssr: false }) as any;
// const TPicker = dynamic(() => import('@mui/x-date-pickers/TimePicker').then(x => x.TimePicker) as any, { ssr: false }) as any;

export const TimePicker = (
    props: TimePickerProps<Dayjs>
) => {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TPicker {...props} />
    </LocalizationProvider>
};