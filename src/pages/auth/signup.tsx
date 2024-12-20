import { AuthForm } from '@/components/auth/auth-form';

export function SignUp() {
  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>
        <AuthForm mode="signup" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}