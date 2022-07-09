import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Auth = ({ children }) => {
  const { data: session, status } = useSession();

  const loading = status === 'loading';
  const hasUser = !!session?.user;

  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasUser) {
      router.push('/sign-in');
    }
  }, [loading, hasUser]);

  if (loading || !hasUser) {
    return <div>Waiting for session...</div>;
  }
  return children;
};

export default Auth;
