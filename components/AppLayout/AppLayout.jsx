import TopNavbar from '../TopNavbar/TopNavbar';
import SideNavbar from '../SideNavbar/SideNavbar';

import classes from './appLayout.module.scss';

const AppLayout = (props) => {
  return (
    <>
      <TopNavbar />
      <SideNavbar />
      <main className={classes.main}>
        {props.children}
        <p className={classes.copyright}>Copyright © 2022 stock-ranks. All rights reserved.</p>
      </main>
    </>
  );
};

export default AppLayout;
