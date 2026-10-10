"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // শুরুতেই পর্দায় থাকা অংশ লুকাই না। শুধু নিচের অংশ লুকিয়ে স্ক্রলে ফোটাই, তাই JS এর আগে বা JS ছাড়া সব দৃশ্যমান
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          observer.disconnect(); // একবার ফুটলেই হলো, আর পর্যবেক্ষণ লাগে না
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: hidden ? "0ms" : `${delay}ms` }}
      className={cn(
        "transition duration-700 ease-out",
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
