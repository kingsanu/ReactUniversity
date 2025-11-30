"use client";

import {
  DateInput as DateInputPrimitive,
  DateSegment,
  type DateInputProps,
  type DateValue
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function DateInput<T extends DateValue>({
  className,
  ...props
}: DateInputProps<T>) {
  return (
    <DateInputPrimitive
      className={twMerge(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          className={({ isPlaceholder, isFocused }) =>
            twMerge(
              "rounded p-0.5 outline-none caret-transparent",
              isPlaceholder && "text-muted-foreground",
              isFocused && "bg-accent text-accent-foreground"
            )
          }
        />
      )}
    </DateInputPrimitive>
  );
}
