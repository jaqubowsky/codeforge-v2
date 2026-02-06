"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeforge-v2/ui/components/select";
import { STATUS_OPTIONS } from "../constants/filter-options";
import type { UserOfferStatus } from "../types/dashboard";

function isUserOfferStatus(value: string): value is UserOfferStatus {
  return STATUS_OPTIONS.some((opt) => opt.value === value);
}

interface StatusDropdownProps {
  currentStatus: UserOfferStatus;
  onStatusChange: (status: UserOfferStatus) => void;
  disabled?: boolean;
}

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  disabled,
}: StatusDropdownProps) {
  return (
    <Select
      disabled={disabled}
      onValueChange={(value) => {
        if (isUserOfferStatus(value)) {
          onStatusChange(value);
        }
      }}
      value={currentStatus}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
