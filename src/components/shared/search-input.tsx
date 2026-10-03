"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlParams } from "@/hooks/use-url-params";

type SearchInputProps = { paramName?: string; placeholder?: string };

export function SearchInput({
  paramName = "search",
  placeholder = "Search…",
}: SearchInputProps) {
  const searchParams = useSearchParams();
  const { setParams } = useUrlParams();

  const urlValue = searchParams.get(paramName) ?? "";
  const [value, setValue] = useState(urlValue);
  const debouncedValue = useDebounce(value, 400);
  const lastPushed = useRef(urlValue);

  // input → URL
  useEffect(() => {
    if (debouncedValue === lastPushed.current) return;
    lastPushed.current = debouncedValue;
    setParams({ [paramName]: debouncedValue }, { mode: "replace" });
  }, [debouncedValue, paramName, setParams]);

  // URL → input (যেমন "Clear filters" চাপলে ঘরটা খালি হওয়া দরকার)
  useEffect(() => {
    if (urlValue !== lastPushed.current) {
      lastPushed.current = urlValue;
      setValue(urlValue);
    }
  }, [urlValue]);

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8"
      />
    </div>
  );
}
