import { useState, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import TextInput from '../shared/formInput/TextInput';
import Button from '../shared/Button/Button';
import classes from './contactUsForm.module.scss';

const ContactUsForm = () => {
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [resMessage, setResMessage] = useState('');
  const message = useRef(null);

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().min(3, 'Must be 3 characters or more').required('Name is required'),
          email: Yup.string().max(30, 'Must be 30 characters or less').email('Invalid email address!').required('Email is required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          if (message.current.value == null || message.current.value.length < 10 || message.current.value > 500) {
            setError('The message should be between 10 and 500 characters long!');
            setSubmitting(false);
            return;
          }

          const res = await fetch('/api/contact-us-form', {
            method: 'POST',
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              message: message.current.value
            }),
            headers: { 'Content-Type': 'application/json' }
          });

          const data = await res.json();

          if (data?.error) {
            setIsSent(false);
            setError(data.message);
            setResMessage('');
          } else {
            setIsSent(true);
            setResMessage(data.message);
            setError(null);
          }

          setSubmitting(false);
          return;
        }}
      >
        {(formik) => (
          <form className={classes.container} onSubmit={formik.handleSubmit}>
            <section className={classes.container__name}>
              <TextInput label='Name' name='name' type='name' placeholder='Enter your name' />
            </section>

            <section className={classes.container__email}>
              <TextInput label='Email Address' name='email' type='email' placeholder='svetoslav@gmail.com' />
            </section>

            <section className={classes.container__message}>
              <h2>Message</h2>
              <textarea name='message' ref={message} cols='30' rows='10' placeholder='Write your message here...'></textarea>
            </section>

            {error && <p className={classes['p--left__error']}>{error}</p>}
            {isSent && <p className={classes['p--left__success']}>{resMessage}</p>}

            <Button type='submit' classType='primary' value={formik.isSubmitting ? 'Submitting ...' : 'Send a message'} />
          </form>
        )}
      </Formik>
    </>
  );
};

export default ContactUsForm;
