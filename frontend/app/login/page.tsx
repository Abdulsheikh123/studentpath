import GoogleAuthButton from "@/components/auth/google-login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen min-w-0 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full min-w-0 max-w-md rounded-3xl border p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-3xl font-bold">Login</h1>
        <p className="mb-6 text-muted-foreground">
          Continue with Google to access StudentPath
        </p>

        <GoogleAuthButton />
      </div>
    </div>
  );
}
