"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// controlled component only; data fetching lives in parent

export function HourSelector({
  value,
  onChange,
}: {
  // value should be controlled by the parent. If undefined, nothing is selected.
  value?: number;
  onChange?: (hour: number) => void;
}) {
  const selectedValue = value != null ? String(value) : undefined;

  function handleChange(v: string) {
    const n = parseInt(v, 10);
    if (Number.isNaN(n)) return;
    onChange?.(n);
  }

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Hour (0-23)">{selectedValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Hour</SelectLabel>
          {Array.from({ length: 24 }, (_, i) => (
            <SelectItem key={i} value={String(i)}>
              {i}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
