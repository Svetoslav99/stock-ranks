import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';

import TextInput from '../shared/formInput/TextInput';
import Button from '../shared/Button/Button';
import { signIn, getCsrfToken } from 'next-auth/react';
import classes from './signIn.module.scss';

function SignIn({ csrfToken }) {
  const [error, setError] = useState(null);

  return (
    <>
      <aside className={classes['background-image-container']}>
        <Image src='/images/log-in-illustration.svg' alt='Log in illustration' className={classes.image__aside} layout='responsive' width={975} height={975} />
      </aside>
      <main className={classes.container}>
        <header className={classes.title}> Sign In with Google</header>
        <span className={classes.providers}>
          <button className={classes.provider} onClick={() => signIn('google')}>
            <Image src='/icons/64/google.svg' alt='Google' width={56} height={56} />
          </button>
        </span>
        <p className={classes['p--center']}>Or Sign in with Email and password</p>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={Yup.object({
            email: Yup.string().max(30, 'Must be 30 characters or less').email('Invalid email address!').required('Email is required'),
            password: Yup.string()
              .max(32, 'Must be 32 characters or less')
              .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Invalid password: must be at least 8 characters long and must contain: 1 uppercase; 1 lowercase; 1 numeric.')
              .required('Password is required')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            console.log('values: ', values);
            const res = await signIn('credentials', {
              redirect: true,
              email: values.email,
              password: values.password,
              // The page where you want to redirect to after a
              // successful login
              callbackUrl: `${window.location.origin}/news/top-headlines`
            });
            console.log('res: ', res);
            const data = await res.json();
            console.log('data: ', data);
            if (data?.error) {
              setError(res.message);
            } else {
              setError(null);
            }

            setSubmitting(false);
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
              <TextInput label='Email Address' name='email' type='email' placeholder='svetoslav@gmail.com' />
              <br />
              <TextInput label='Password' name='password' type='password' placeholder='**************' />
              <br />
              <div>
                <p className={classes['p--right']}>
                  <Link href='/sign-in/forgot-password'>Forgot password?</Link>
                </p>
                <Button type='submit' classType='primary' value={formik.isSubmitting ? 'Please wait...' : 'Sign In'} />
                <p className={classes['p--left']}>
                  Don`t have an account?
                  <Link href='/sign-up'>Sign up</Link>
                </p>
              </div>
              <br />
              {error && <p className={classes['p--left__error']}>{error}</p>}
            </form>
          )}
        </Formik>
      </main>
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  console.log('context: ', context);
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}

export default SignIn;
