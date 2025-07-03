import { useEffect, useRef, useState } from "react";
import type { OAuthProviderName } from "@/lib/oauth";

export function useOAuth(providerName: OAuthProviderName) {
  const popupRef = useRef<Window | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function startOAuth() {
    setIsLoading(true);
    popupRef.current = openOAuthWindow(
      `/api/auth/${providerName.toLowerCase()}`,
      providerName
    );
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

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== process.env.BASE_URL!) return;

      if (event.data.type === "oauth-success") {
        setIsLoading(false);
        popupRef.current?.close();
      }
      if (event.data.type === "oauth-error") {
        setIsLoading(false);
        popupRef.current?.close();
        alert(event.data.message || "OAuth error");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { isLoading, startOAuth };
}
