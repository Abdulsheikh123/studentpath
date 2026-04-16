"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildAdminUrl } from "@/lib/admin-api";

type AuthUser = {
  name: string;
  email: string;
  profileImage: string;
};

type GoogleAuthButtonProps = {
  onLoginSuccess?: (user: AuthUser) => void;
  onLoginError?: (message: string) => void;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      text.startsWith("<!DOCTYPE")
        ? "Auth endpoint not found. Check API route configuration."
        : "Unexpected server response format.",
    );
  }
  return (await response.json()) as T;
}

export default function GoogleAuthButton({
  onLoginSuccess,
  onLoginError,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsSubmitting(true);
      onLoginError?.("");

      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing");
      }

      const loginResponse = await fetch(buildAdminUrl("/api/users/login"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await parseResponse<{ message?: string }>(loginResponse);
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      const sessionResponse = await fetch(buildAdminUrl("/api/users/me"), {
        credentials: "include",
        cache: "no-store",
      });

      if (!sessionResponse.ok) {
        throw new Error("Unable to load your session after login.");
      }

      const sessionData = await parseResponse<{ user: AuthUser }>(sessionResponse);

      onLoginSuccess?.(sessionData.user);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

      onLoginError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="space-y-3">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Google Login Failed");
            onLoginError?.("Google sign-in failed. Please try again.");
          }}
        />
        {isSubmitting ? (
          <p className="text-sm text-muted-foreground">Signing you in...</p>
        ) : null}
      </div>
    </GoogleOAuthProvider>
  );
}
