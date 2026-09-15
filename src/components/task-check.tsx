"use client";

import { cn } from "cn";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";

export function TaskCheck({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="task-check"
      className={cn(
        "relative mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#b8b8b8] bg-background text-primary-foreground transition-colors outline-none after:absolute after:-inset-2 hover:border-primary hover:bg-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-content-center">
        <CheckIcon className="size-2.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
