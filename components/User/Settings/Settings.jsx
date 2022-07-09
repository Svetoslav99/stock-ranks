import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames';

import TextInput from '../../shared/formInput/TextInput';
import Button from '../../shared/Button/Button';
import classes from './settings.module.scss';

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
const invalidPasswordMessage = 'Invalid password: must be at least 8 characters long and must contain: 1 uppercase; 1 lowercase; 1 numeric.';

const Settings = () => {
  const [errorAvatar, setErrorAvatar] = useState('');
  const [messageAvatar, setMessageAvatar] = useState('');

  const [errorUsername, setErrorUsername] = useState('');
  const [messageUsername, setMessageUsername] = useState('');

  const [errorPassword, setErrorPassword] = useState('');
  const [messagePassword, setMessagePassword] = useState('');

  const { data: session } = useSession();

  return (
    <section className={classes.container}>
      <section className={classes['container--form']}>
        <h2 className={cn(classes.title, classes['text--center'])}>User Settings</h2>
        <hr className={classes.hr} />
        <section>
          <h2 className={cn(classes.title, classes['text--center'])}> Change your avatar </h2>

          <Formik
            initialValues={{
              resourceLink: ''
            }}
            validationSchema={Yup.object({
              resourceLink: Yup.string()
                .min(10, 'The link should be atleast 10 characters long.')
                .matches(/^https?:\/\//, `Invalid link: must start with 'http://' or 'https://'.`)
                .required('Link to image is required.')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = await fetch('/api/settings-avatar', {
                method: 'POST',
                body: JSON.stringify({
                  resourceLink: values.resourceLink,
                  email: session.user.email
                }),
                headers: { 'Content-Type': 'application/json' }
              });
              console.log('res: ', res);
              const data = await res.json();

              console.log('data: ', data);

              if (data?.error) {
                setErrorAvatar(data.message);
                setMessageAvatar(null);
              } else {
                setMessageAvatar(`${data.message} Signing you out after 5 seconds to update your avatar. Please log in again.`);
                setErrorAvatar(null);
                setTimeout(() => signOut(), 5000);
              }

              setSubmitting(false);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <TextInput
                  label='Link to image'
                  name='resourceLink'
                  type='text'
                  placeholder={
                    session.user.image ||
                    'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?b=1&k=20&m=476085198&s=170667a&w=0&h=Ct4e1kIOdCOrEgvsQg4A1qeuQv944pPFORUQcaGw4oI='
                  }
                />

                <div className={classes['container--button']}>
                  <Button type='submit' classType='primary-big' title='Updating will cause you to log in again' value={formik.isSubmitting ? 'Please wait...' : 'Update avatar'} />
                </div>
              </form>
            )}
          </Formik>
          {errorAvatar && (
            <p className={cn(classes.text, classes.message, classes['text--center'], classes['text--red'])}>
              <b>{errorAvatar}</b>
            </p>
          )}
          {messageAvatar && (
            <p className={cn(classes.text, classes.message, classes['text--center'], classes['text--green'])}>
              <b>{messageAvatar}</b>
            </p>
          )}
        </section>

        <hr className={classes.hr} />

        <section>
          <h2 className={cn(classes.title, classes['text--center'])}> Change your username </h2>

          <Formik
            initialValues={{
              username: ''
            }}
            validationSchema={Yup.object({
              username: Yup.string()
                .min(3, 'Username should be atleast 3 characters long!')
                .max(18, 'Username should not be more than 18 characters long!')
                .required('Username is required!')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = await fetch('/api/settings-username', {
                method: 'POST',
                body: JSON.stringify({
                  username: values.username,
                  email: session.user.email
                }),
                headers: { 'Content-Type': 'application/json' }
              });
              const data = await res.json();

              if (data?.error) {
                setErrorUsername(data.message);
                setMessageUsername(null);
              } else {
                setMessageUsername(`${data.message} Signing you out after 5 seconds to update your username. Please log in again.`);
                setErrorUsername(null);
                setTimeout(() => signOut(), 5000);
              }

              setSubmitting(false);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <TextInput label='New username' name='username' type='text' placeholder={session.user.name || 'David87'} />

                <div className={classes['container--button']}>
                  <Button type='submit' classType='primary-big' title='Updating will cause you to log in again' value={formik.isSubmitting ? 'Please wait...' : 'Update username'} />
                </div>
              </form>
            )}
          </Formik>
          {errorUsername && (
            <p className={cn(classes.text, classes.message, classes['text--center'], classes['text--red'])}>
              <b>{errorUsername}</b>
            </p>
          )}
          {messageUsername && (
            <p className={cn(classes.text, classes.message, classes['text--center'], classes['text--green'])}>
              <b>{messageUsername}</b>
            </p>
          )}
        </section>

        <hr className={classes.hr} />

        {session.provider === 'credentials' && (
          <section>
            <h2 className={cn(classes.title, classes['text--center'])}> Change your password </h2>

            <Formik
              initialValues={{
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
              }}
              validationSchema={Yup.object({
                oldPassword: Yup.string().min(8, 'Must be 8 characters or more').max(32, 'Must be 32 characters or less').required('Password is required'),
                newPassword: Yup.string().max(32, 'Must be 32 characters or less').matches(passwordRegex, invalidPasswordMessage).required('Password is required'),
                confirmNewPassword: Yup.string().max(32, 'Must be 32 characters or less').matches(passwordRegex, invalidPasswordMessage).required('Password is required')
              })}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('values: ', values);

                if (values.newPassword !== values.confirmNewPassword) {
                  setErrorPassword('Password mismatch. Please check your passwords and try again.');
                  setSubmitting(false);
                  return;
                }

                const res = await fetch('/api/settings-password', {
                  method: 'POST',
                  body: JSON.stringify({
                    email: session.user.email,
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                  }),
                  headers: { 'Content-Type': 'application/json' }
                });

                const data = await res.json();

                if (data?.error) {
                  setErrorPassword(data.message);
                  setMessagePassword(null);
                } else {
                  setMessagePassword(`${data.message}. Signing you out after 5 seconds to refresh your session.`);
                  setErrorPassword(null);
                  setTimeout(() => signOut(), 5000);
                }

                setSubmitting(false);
              }}
            >
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <TextInput label='Old Password' name='oldPassword' type='password' placeholder='**************' />
                  <br />
                  <TextInput label='New Password' name='newPassword' type='password' placeholder='**************' />
                  <br />
                  <TextInput label='Confirm New Password' name='confirmNewPassword' type='password' placeholder='**************' />

                  <div className={classes['container--button']}>
                    <Button type='submit' classType='primary-big' title='Updating will cause you to log in again' value={formik.isSubmitting ? 'Please wait...' : 'Update password'} />
                  </div>
                </form>
              )}
            </Formik>
          </section>
        )}
        {errorPassword && (
          <p className={cn(classes.text, classes.message, classes['text--center'], classes['text--red'])}>
            <b>{errorPassword}</b>
          </p>
        )}
        {messagePassword && (
          <p className={cn(classes.text, classes.message, classes['text--center'], classes['text--green'])}>
            <b>{messagePassword}</b>
          </p>
        )}
      </section>
    </section>
  );
};

export default Settings;