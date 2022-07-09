import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import cn from 'classnames';

import TextInput from '../shared/formInput/TextInput';
import Button from '../shared/Button/Button';
import classes from './forgotPassword.module.scss';

const textInputStyle = {
  input: classes.input,
  error: classes.error
};

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState(null);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Forgot password</title>
        <meta name='description' content='Forgot password page' />
      </Head>
      <div className={classes.container}>
        <div className={classes.formContainer}>
          <section className={classes.imageContainer}>
            <Image src='/images/forgot-password-illustration.svg' alt='Forgot password illustration' width={400} height={400} />
          </section>

          <section className={classes['text-container']}>
            <p className={cn(classes.text, classes.text__title)}>Fortgot your password?</p>
            <p className={cn(classes.text, classes.text__body)}>Enter your email address and we`ll send you random generated new password</p>
          </section>

          <Formik
            initialValues={{
              email: ''
            }}
            validationSchema={Yup.object({
              email: Yup.string().email('Invalid email address!').required('Email is required')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = await fetch('/api/forgot-password', {
                method: 'POST',
                body: JSON.stringify({
                  email: values.email
                }),
                headers: { 'Content-Type': 'application/json' }
              });

              const data = await res.json();

              if (data?.error) {
                setIsSent(false);
                setMessage(null);
                setError(data.message);
              } else {
                setIsSent(true);
                setMessage(data.message);
                setError(null);
              }

              setSubmitting(false);
              return;
            }}
          >
            {(formik) => (
              <form className={classes.container} onSubmit={formik.handleSubmit}>
                <TextInput name='email' type='email' placeholder='svetoslav@gmail.com' customStyle={textInputStyle} />
                <br />

                {error && <p className={classes['p--left__error']}>{error}</p>}
                {isSent && <p className={classes['p--left__success']}>{message}</p>}

                <section className={classes.buttonsContainer}>
                  <Link href='/sign-in'>
                    <Button type='button' classType='secondary-small' value='Cancel' onClick={() => router.replace('/sign-in')} />
                  </Link>

                  <Button type='submit' classType='primary-small' value={formik.isSubmitting ? 'Submitting...' : 'Send an email'} />
                </section>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
