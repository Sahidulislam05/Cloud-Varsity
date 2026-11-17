// src/components/auth/google-login-button.tsx
"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";

type GoogleCredentialResponse = { credential?: string };

// Minimal typing for the parts of Google Identity Services we use
type GoogleIdApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          theme: "outline" | "filled_blue" | "filled_black";
          size: "large";
          text: "signin_with";
          shape: "rectangular";
          width?: number;
        },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdApi;
  }
}

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";

export function GoogleLoginButton({ clientId }: { clientId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);
  const googleLogin = useGoogleLogin();

  // The GIS callback is registered once when the script loads, so it reads
  // through a ref to always reach the latest mutation object
  const loginRef = useRef(googleLogin);
  useEffect(() => {
    loginRef.current = googleLogin;
  });

  const handleGoogleScriptReady = () => {
    // onReady fires on every mount; the button must only be rendered once
    if (renderedRef.current || !window.google) return;
    const container = containerRef.current;
    if (!container) return;

    renderedRef.current = true;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const idToken = response.credential;
        if (!idToken) return;

        loginRef.current.mutate(idToken, {
          onError: (error) => {
            toast.error(
              error instanceof ApiError
                ? `Google login failed: ${error.message}`
                : "Google login failed. Please try again.",
            );
          },
        });
      },
    });
    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: container.offsetWidth || 320,
    });
  };

  return (
    <div>
      <Script
        src={GIS_SCRIPT_URL}
        strategy="afterInteractive"
        onReady={handleGoogleScriptReady}
      />
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}
