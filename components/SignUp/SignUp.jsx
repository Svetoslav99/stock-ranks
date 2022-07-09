import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames';

import TextInput from '../shared/formInput/TextInput';
import Button from '../shared/Button/Button';
import classes from './signUp.module.scss';

function SignUp() {
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(null);

  return (
    <>
      <aside className={cn(classes['background-image-container'], classes['background-image-container--sign-up'])}>
        <Image src='/images/sign-up-illustration.svg' alt='Log in illustration' className={classes.image__aside} layout='responsive' width={975} height={975} />
      </aside>

      <main className={classes.container}>
        <header className={classes.title}> Sign Up</header>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={Yup.object({
            email: Yup.string().max(30, 'Must be 30 characters or less').email('Invalid email address!').required('Email is required'),
            password: Yup.string()
              .max(32, 'Must be 32 characters or less')
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                'Invalid password: must be at least 8 characters long and must contain: 1 uppercase; 1 lowercase; 1 numeric.'
              )
              .required('Password is required'),
            confirmPassword: Yup.string()
              .max(32, 'Must be 32 characters or less')
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                'Invalid password: must be at least 8 characters long and must contain: 1 uppercase; 1 lowercase; 1 numeric.'
              )
              .required('Password is required')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            if (values.password !== values.confirmPassword) {
              setError('Password mismatch. Please check your passwords and try again.');
              setSubmitting(false);
              return;
            }

            const res = await fetch('/api/sign-up', {
              method: 'POST',
              body: JSON.stringify({
                email: values.email,
                password: values.password
              }),
              headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (data?.error) {
              setIsRegistered(false);
              setError(data.message);
            } else {
              setIsRegistered(true);
              setError(null);
            }

            setSubmitting(false);
            return;
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <TextInput label='Email Address' name='email' type='email' placeholder='svetoslav@gmail.com' />
              <br />

              <TextInput label='Password' name='password' type='password' placeholder='**************' />
              <br />
              <TextInput label='Confirm Password' name='confirmPassword' type='password' placeholder='**************' />
              {error && <p className={classes['p--left__error']}>{error}</p>}
              {isRegistered && <p className={classes['p--left__success']}>Registered successfully!</p>}
              <div>
                <Button type='submit' classType='primary' value={formik.isSubmitting ? 'Please wait...' : 'Sign Up'} />
                <p className={classes['p--left']}>
                  Already have an account?
                  <Link href='/sign-in'>Sign in</Link>
                </p>
              </div>
              <br />
            </form>
          )}
        </Formik>
      </main>
    </>
  );
}

export default SignUp;
