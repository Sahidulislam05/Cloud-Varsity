"use client";

import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlParams } from "@/hooks/use-url-params";

const ALL = "__all__";

type FilterSelectProps = {
  paramName: string;
  label: string;
  options: { value: string; label: string }[];
  allLabel?: string;
  defaultValue?: string;
};

export function FilterSelect({
  paramName,
  label,
  options,
  allLabel,
  defaultValue,
}: FilterSelectProps) {
  const searchParams = useSearchParams();
  const { setParams } = useUrlParams();

  const current =
    searchParams.get(paramName) ?? (allLabel ? ALL : defaultValue);

  const handleChange = (next: string) => {
    // ডিফল্ট মান হলে URL থেকে param সরিয়ে দিই, URL পরিষ্কার থাকে
    const isDefault = next === ALL || next === defaultValue;
    setParams({ [paramName]: isDefault ? null : next });
  };

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger aria-label={label} className="w-full sm:w-56">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
