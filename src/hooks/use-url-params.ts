"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type SetParamsOptions = { mode?: "push" | "replace"; keepPage?: boolean };

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();

  const setParams = useCallback(
    (
      updates: Record<string, string | null>,
      { mode = "push", keepPage = false }: SetParamsOptions = {},
    ) => {
      const params = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }

      // ফিল্টার বদলালে আগের page নম্বর অর্থহীন, তাই page 1 এ ফিরে যাই
      if (!keepPage) params.delete("page");

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (mode === "replace") router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [router, pathname],
  );

  return { setParams };
}
