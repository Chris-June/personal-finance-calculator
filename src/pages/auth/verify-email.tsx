import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        toast({
          title: 'Error',
          description: 'Invalid verification link',
          variant: 'destructive',
        });
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          toast({
            title: 'Success',
            description: data.message,
          });
        } else {
          toast({
            title: 'Error',
            description: data.message,
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to verify email',
          variant: 'destructive',
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, toast]);

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Email Verification</h1>
          {verifying ? (
            <p className="text-sm text-muted-foreground">Verifying your email...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                You can now sign in to your account
              </p>
              <Button onClick={() => navigate('/auth/signin')}>
                Go to Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
