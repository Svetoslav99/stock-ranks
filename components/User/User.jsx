import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import cn from 'classnames';

import classes from './user.module.scss';

const User = (props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: session } = useSession();

  const imageSrc = session?.user?.image.trim() || '/icons/48/avatar.svg';

  const logOut = () => {
    console.log('Logging out...');
    signOut();
  };

  return (
    <div className={classes.container}>
      <section className={classes['container__user']}>
        <p className={cn(classes.username, classes.item)} onClick={() => setSettingsOpen(!settingsOpen)}>
          {session?.user?.name || 'Unknown'}
        </p>
        <button className={classes.button} onClick={() => setSettingsOpen(!settingsOpen)}>
          <img src={imageSrc} alt='Avatar image' className={classes.img} />
        </button>
        {settingsOpen && (
          <section className={classes['dropdown-menu']}>
            <p className={classes.title}>Profile</p>
            <hr className={classes.hr} />
            <ul>
              {session.provider === 'credentials' && (
                <li onClick={() => setSettingsOpen(!settingsOpen)}>
                  <Link href='/settings'>Settings</Link>
                </li>
              )}
              <li onClick={logOut}>
                <Link href='/sign-in'>Log out</Link>
              </li>
            </ul>
          </section>
        )}
      </section>
    </div>
  );
};

export default User;
