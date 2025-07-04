export type OAuthProviderName = "Google" | "Facebook";

type ProviderConfig = {
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export const providers: Record<string, ProviderConfig> = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: "openid email profile",
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  },
};

export function getOAuthHtml(
  status: "success" | "error",
  redirectTo: string = "/"
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OAuth ${status}</title>
      </head>
      <body>
        <script>
          window.opener.postMessage(
            { type: 'oauth-${status}', message: 'Login successful' },
            window.origin
          );
          window.opener.location.href = '${process.env.BASE_URL}${redirectTo}';
          ${status === "success" ? "document.cookie = 'redirectTo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';" : ""}
          window.close();
        </script>
        ${status === "success" ? "<p>Login successful. You can close this window.</p>" : "<p>Login failed. Please close this window and try again.</p>"}
      </body>
    </html>
  `;
}
