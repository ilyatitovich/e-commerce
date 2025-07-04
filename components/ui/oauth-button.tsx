import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Button } from "./button";
import { useOAuth } from "@/hooks/useOAuth";
import type { OAuthProviderName } from "@/lib/oauth";

type OAuthButtonProps = {
  providerName: OAuthProviderName;
  icon: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const OAuthButton = forwardRef<HTMLButtonElement, OAuthButtonProps>(
  ({ providerName, icon, disabled, children, ...props }, ref) => {
    const { authState, startOAuth } = useOAuth(providerName);

    return (
      <Button
        type="button"
        ref={ref}
        disabled={disabled || authState === "popupOpen"}
        className="flex items-center justify-center gap-2 bg-white border border-black hover:bg-white"
        {...props}
        onClick={(e) => {
          props.onClick?.(e);
          startOAuth();
        }}
      >
        {authState === "popupOpen" ? (
          <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full" />
        ) : (
          icon
        )}
        <span className="text-black">
          {children ?? `Continue with ${providerName}`}
        </span>
      </Button>
    );
  }
);

OAuthButton.displayName = "OAuthButton";
