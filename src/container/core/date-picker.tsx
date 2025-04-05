"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@utils";
import { Button } from "@core/button";
import { Calendar } from "@core/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@core/popover";

interface DatePickerProps {
    selectedDate?: Date;
    onSelect: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
}

export function DatePicker({
    selectedDate,
    onSelect,
    className,
    placeholder = "Select date",
}: DatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(selectedDate);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setDate(selectedDate);
    }, [selectedDate]);

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        onSelect(selectedDate);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
