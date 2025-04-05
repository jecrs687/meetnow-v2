"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@utils";
import { Button } from "@core/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@core/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@core/popover";

// Generate time slots every 30 minutes
const generateTimeSlots = () => {
    const timeSlots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const h = hour.toString().padStart(2, "0");
            const m = minute.toString().padStart(2, "0");

            // Use 12-hour format for display
            const hourIn12 = hour % 12 || 12;
            const amPm = hour < 12 ? "AM" : "PM";
            const formattedTime = `${hourIn12}:${m.padStart(2, "0")} ${amPm}`;

            timeSlots.push(formattedTime);
        }
    }
    return timeSlots;
};

const TIME_SLOTS = generateTimeSlots();

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function TimePicker({
    value,
    onChange,
    className,
    placeholder = "Select time",
}: TimePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {value || placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search time..." />
                    <CommandList className="h-[300px]">
                        <CommandEmpty>No time found.</CommandEmpty>
                        <CommandGroup>
                            {TIME_SLOTS.map((time) => (
                                <CommandItem
                                    key={time}
                                    onSelect={() => {
                                        onChange(time);
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {time}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
