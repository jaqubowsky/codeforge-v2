"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeforge-v2/ui/components/select";
import { STATUS_OPTIONS } from "../constants";
import type { UserOfferStatus } from "../types";

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
      onValueChange={(value) => onStatusChange(value as UserOfferStatus)}
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
