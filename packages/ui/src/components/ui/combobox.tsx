"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  creatable?: boolean;
  createText?: string;
}

export function Combobox({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  creatable = false,
  createText = "Add",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const canCreate = React.useMemo(() => {
    if (!(creatable && search.trim())) {
      return false;
    }
    const searchLower = search.toLowerCase().trim();
    const existsInOptions = options.some(
      (opt) => opt.value.toLowerCase() === searchLower
    );
    const existsInValue = value.some((v) => v.toLowerCase() === searchLower);
    return !(existsInOptions || existsInValue);
  }, [creatable, search, options, value]);

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange?.(newValue);
  };

  const handleCreate = () => {
    const trimmed = search.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange?.([...value, trimmed]);
      setSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canCreate) {
      e.preventDefault();
      handleCreate();
    }
  };

  const displayText = React.useMemo(() => {
    if (value.length === 0) {
      return placeholder;
    }
    if (value.length === 1) {
      const selected = options.find((opt) => opt.value === value[0]);
      return selected?.label || value[0];
    }
    return `${value.length} selected`;
  }, [value, options, placeholder]);

  return (
    <PopoverPrimitive.Root onOpenChange={setOpen} open={open}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">{displayText}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          className="w-[--radix-popover-trigger-width] p-0"
        >
          <CommandPrimitive className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
            <div className="flex items-center border-b px-3">
              <CommandPrimitive.Input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={handleKeyDown}
                onValueChange={setSearch}
                placeholder={searchPlaceholder}
                value={search}
              />
            </div>
            <CommandPrimitive.List className="max-h-64 overflow-y-auto p-1">
              {canCreate && (
                <CommandPrimitive.Item
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  onSelect={handleCreate}
                  value={`create-${search}`}
                >
                  <Plus className="size-4 text-primary" />
                  <span>
                    {createText} "
                    <span className="font-medium">{search.trim()}</span>"
                  </span>
                </CommandPrimitive.Item>
              )}
              {filtered.length === 0 && !canCreate && (
                <div className="py-6 text-center text-sm">{emptyText}</div>
              )}
              {filtered.map((option) => (
                <CommandPrimitive.Item
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  value={option.value}
                >
                  <div
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm border border-primary",
                      value.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className="size-3" />
                  </div>
                  <span>{option.label}</span>
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
