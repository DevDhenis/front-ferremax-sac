import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

// react-day-picker (v10) calendar styled with the "Quiet" palette tokens.
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        months: "relative",
        month: "space-y-2",
        month_caption: "flex items-center justify-center h-9",
        caption_label: "text-sm font-semibold text-foreground pointer-events-none",
        nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between h-9 px-1",
        button_previous:
          "size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-40",
        button_next:
          "size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-40",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-[11px] font-medium text-muted-foreground",
        week: "flex w-full mt-1",
        day: "w-9 h-9 p-0 text-center text-sm relative",
        day_button:
          "size-9 inline-flex items-center justify-center rounded-md font-spec text-sm text-foreground hover:bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary/30 aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
        today: "[&>button]:font-bold [&>button]:text-primary aria-selected:[&>button]:text-primary-foreground",
        outside: "[&>button]:text-muted-foreground/40",
        disabled: "[&>button]:text-muted-foreground/30 [&>button]:opacity-50 [&>button]:pointer-events-none",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
