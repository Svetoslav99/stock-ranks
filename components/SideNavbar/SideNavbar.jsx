import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

import classes from './sideNavbar.module.scss';

const SideNavbar = () => {
  return (
    <aside className={cn(classes.sidebar, classes.close)}>
      <div className={classes.logo_container}>
        <Image src='/icons/default2.png' alt='News image' width={160} height={80} />
      </div>
      <hr className={classes.hr} />
      <ul className={classes['nav-links']}>
        <li className={classes.list}>
          <div className={classes.sidebar__link}>
            <div className={classes['sidebar__link-content']}>
              <Image src='/icons/40/news.svg' alt='News image' width={32} height={32} />
              <p className={classes.sidebar__text}>News</p>
            </div>
          </div>
          <ul className={classes['sub-menu']}>
            <li>
              <p className={cn(classes.link_name, classes['hr--centered'])}>News</p>
              <hr />
            </li>
            <li>
              <Link href='/news/top-headlines'>Top Headlines</Link>
            </li>
            <li>
              <Link href='/news/latest-articles'>Latest Articles</Link>
            </li>
          </ul>
        </li>

        <li className={classes.list}>
          <div className={classes.sidebar__link}>
            <Link href='/crypto-events'>
              <div className={classes['sidebar__link-content']}>
                <Image src='/icons/40/crypto-events.svg' alt='Crypto events image' width={32} height={32} />
                <p className={classes.sidebar__text}>Crypto Events</p>
              </div>
            </Link>
          </div>
        </li>

        <li className={classes.list}>
          <div className={classes.sidebar__link}>
            <div className={classes['sidebar__link-content']}>
              <Image src='/icons/40/calendar.svg' alt='Calendar image' width={36} height={36} />
              <p className={classes.sidebar__text}>Calendars</p>
            </div>
          </div>
          <ul className={classes['sub-menu']}>
            <li>
              <p className={cn(classes.link_name, classes['hr--centered'])}>Calendars</p>
              <hr />
            </li>
            <li>
              <Link href='/calendars/earnings'>Earnings</Link>
            </li>
            <li>
              <Link href='/calendars/ipos'>IPOs</Link>
            </li>
            <li>
              <Link href='/calendars/economic-events'>Economic Events</Link>
            </li>
          </ul>
        </li>

        <li className={cn(classes.list, classes.contact_us_container)}>
          <div className={classes.sidebar__link}>
            <Link href='/contact-us'>
              <div className={classes['sidebar__link-content']}>
                <Image src='/icons/40/contact-us.svg' alt='Crypto news image' width={40} height={30} />
                <p className={classes.sidebar__text}>Contact us</p>
              </div>
            </Link>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default SideNavbar;
