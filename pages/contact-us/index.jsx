import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import ContactUsForm from '../../components/ContactUsForm/ContactUsForm';
import classes from './contactUs.module.scss';

const ContactUs = () => {
  return (
    <>
      <Head>
        <title>Contact us</title>
        <meta name='description' content='Contact us page' />
      </Head>
      <div className={classes.container}>
        <section className={classes.header}>
          <h1 className={classes.header__title}>Contact us!</h1>
          <h3 className={classes.header__body}>Just fill up the form and our team will reach out in 3 business days</h3>
        </section>

        <section className={classes.container__contacts}>
          <div className={classes.container__contact}>
            <Image src='/icons/64/email.svg' alt='Email icon' width={48} height={48} />
            <p>stockranksofficial@abv.bg</p>
          </div>

          <div className={classes.container__contact}>
            <Image src='/icons/64/phone.svg' alt='Phone icon' width={48} height={48} />
            <p>+359 878 851 704</p>
          </div>

          <div className={classes.container__contact}>
            <Image src='/icons/64/location.svg' alt='Location icon' width={48} height={48} />
            <p>Vitosha 8, Varna, Bulgaria</p>
          </div>
        </section>

        <section className={classes['container__social-media']}>
          <p className={classes['social-media__header']}>Or contact us via social media</p>

          <div className={classes['container__social-media-links']}>
            <div className={classes['social-media']}>
              <a target='_blank' href='https://www.facebook.com/profile.php?id=100080134877063' rel='noopener noreferrer'>
                <Image src='/icons/64/facebook.svg' alt='Facebook icon' width={48} height={48} />
              </a>
            </div>

            <div className={classes['social-media']}>
              <a target='_blank' href='https://twitter.com/Stock_Ranks' rel='noopener noreferrer'>
                <Image src='/icons/64/twitter.svg' alt='Twitter icon' width={64} height={64} />
              </a>
            </div>
          </div>
        </section>

        <section className={classes.container__illustration}>
          <Image src='/images/contact-us-illustration.svg' alt='Contact us illustration' layout='responsive' width={1600} height={1600} />
        </section>

        <ContactUsForm />
      </div>
    </>
  );
};

ContactUs.auth = {
  role: 'user'
};

export default ContactUs;
