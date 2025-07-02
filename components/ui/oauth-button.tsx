import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Button } from "./button";

type OAuthButtonProps = {
  providerName: string;
  icon: React.ReactNode;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const OAuthButton = forwardRef<HTMLButtonElement, OAuthButtonProps>(
  (
    { providerName, icon, loading = false, disabled, children, ...props },
    ref
  ) => {
    return (
      <Button
        type="button"
        ref={ref}
        disabled={disabled || loading}
        className="flex items-center justify-center gap-2 bg-white border border-black hover:bg-white"
        {...props}
      >
        {loading ? (
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
