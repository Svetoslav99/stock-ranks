import cn from 'classnames';

import classes from './button.module.scss';

const Button = ({ type, classType, value, title, onClick }) => {
  switch (classType) {
    case 'small':
      return (
        <button type={type} className={cn(classes.button, classes['button--small-card'])}>
          {value}
        </button>
      );
    case 'primary':
      return (
        <button type={type} className={cn(classes.button, classes['button--primary'])}>
          {value}
        </button>
      );
    case 'primary-small':
      return (
        <button type={type} className={cn(classes.button, classes['button--primary--small'])}>
          {value}
        </button>
      );
    case 'primary-big':
      return (
        <button type={type} className={cn(classes.button, classes['button--primary--big'])} title={title}>
          {value}
        </button>
      );
    case 'secondary-small':
      return (
        <button type={type} className={cn(classes.button, classes['button--secondary--small'])} onClick={onClick}>
          {value}
        </button>
      );
    default:
      return (
        <button type={type} className={classes.button}>
          {value}
        </button>
      );
  }
};

export default Button;
