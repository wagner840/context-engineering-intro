"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface CalendarProps {
  className?: string;
  [key: string]: any;
}

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3 bg-card rounded-md", className)}
      {...props}
    />
  );
}
