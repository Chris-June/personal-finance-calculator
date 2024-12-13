import { AuthForm } from '@/components/auth/auth-form';

export function SignIn() {
  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 rounded-md bg-muted p-4">
              <p className="text-xs text-muted-foreground">
                Test Credentials:<br />
                Email: test@example.com<br />
                Password: Test@123
              </p>
            </div>
          )}
        </div>
        <AuthForm mode="signin" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}