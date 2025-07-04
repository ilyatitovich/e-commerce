import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { OAuthProviderName } from "@/lib/oauth";

type AuthState =
  | "idle"
  | "popupOpen"
  | "authSuccess"
  | "authFailed"
  | "popupClosed";

interface OAuthHookResult {
  authState: AuthState;
  startOAuth: () => void;
}

export function useOAuth(providerName: OAuthProviderName): OAuthHookResult {
  const searchParams = useSearchParams();
  const popupRef = useRef<Window | null>(null);
  const stateRef = useRef<string | null>(null); // For CSRF state parameter
  const [authState, setAuthState] = useState<AuthState>("idle");

  function startOAuth(): void {
    // Generate CSRF state
    stateRef.current = crypto.randomUUID();

    // Get redirect URL from search params or default to '/'
    const redirectTo = searchParams.get("redirectTo") || "/";

    // Store redirect URL in cookie (max-age: 5 minutes)
    document.cookie = `redirectTo=${encodeURIComponent(redirectTo)}; path=/; max-age=300; SameSite=Lax`;

    // Construct OAuth URL with CSRF state
    const baseUrl = process.env.BASE_URL || window.location.origin;
    const oauthUrl = `${baseUrl}/api/auth/${providerName.toLowerCase()}?state=${stateRef.current}`;

    // Open popup
    popupRef.current = openOAuthWindow(oauthUrl, providerName);

    if (!popupRef.current) {
      setAuthState("authFailed");
      return;
    }

    setAuthState("popupOpen");
  }

  function openOAuthWindow(link: string, title: string): Window | null {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    return window.open(
      link,
      title,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  }

  // Handle postMessage events from OAuth provider
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const baseUrl = process.env.BASE_URL || window.location.origin;

      if (event.origin !== baseUrl) return;

      const { type, code, error } = event.data;

      // Verify CSRF state
      // if (state !== stateRef.current) {
      //   setAuthState("authFailed");
      //   popupRef.current?.close();
      //   return;
      // }

      if (type === "oauth-success" && code) {
        setAuthState("authSuccess");
        popupRef.current?.close();
      } else if (type === "oauth-error" || error) {
        setAuthState("authFailed");
        popupRef.current?.close();
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (authState !== "popupOpen") return;

    let rafId: number;

    const checkPopup = () => {
      if (!popupRef.current || popupRef.current.closed) {
        setAuthState("popupClosed");
        return;
      }
      rafId = requestAnimationFrame(checkPopup);
    };

    rafId = requestAnimationFrame(checkPopup);

    const timeout = setTimeout(
      () => {
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
          setAuthState("popupClosed");
        }
      },
      5 * 60 * 1000
    );

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeout);
    };
  }, [authState]);

  return { authState, startOAuth };
}
