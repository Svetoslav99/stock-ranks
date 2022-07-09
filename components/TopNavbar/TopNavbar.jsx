import User from '../User/User';
import classes from './topNavbar.module.scss';

const TopNavbar = () => {
  return (
    <div className={classes.container}>
      <User />
    </div>
  );
};

export default TopNavbar;
