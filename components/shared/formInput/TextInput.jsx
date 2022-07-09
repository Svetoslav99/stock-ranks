import { useField } from 'formik';
import { useState } from 'react';
import cn from 'classnames';
import classes from './textInput.module.scss';

const TextInput = ({ label, icon, customStyle, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  const [passwordShown, setPasswordShown] = useState(false);

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      {label ? (
        <>
          <label
            htmlFor={props.id || props.name}
            className={cn(classes.input, classes.input__label)}
          >
            {label}
          </label>
          <br />
        </>
      ) : null}

      {label?.includes('Password') ? (
        customStyle?.input ? (
          <div>
            <input
              {...field}
              {...props}
              className={customStyle.input}
              type={passwordShown ? 'text' : 'password'}
            />
            <button type='button' className={classes['password-button']} onClick={togglePassword}>
              {passwordShown ? (
                <i className={classes['icon__password-shown']}></i>
              ) : (
                <i className={classes['icon__password-not-shown']}></i>
              )}
            </button>
          </div>
        ) : (
          <div className={classes.passwordContainer}>
            <input
              {...field}
              {...props}
              className={classes.input}
              type={passwordShown ? 'text' : 'password'}
            />
            <button type='button' className={classes['password-button']} onClick={togglePassword}>
              {passwordShown ? (
                <i className={cn(classes.icon, classes['icon__password-not-shown'])}></i>
              ) : (
                <i className={cn(classes.icon, classes['icon__password-shown'])}></i>
              )}
            </button>
          </div>
        )
      ) : customStyle?.input ? (
        <input {...field} {...props} className={customStyle.input} />
      ) : (
        <input {...field} {...props} className={classes.input} />
      )}

      {meta.touched && meta.error ? (
        customStyle?.error ? (
          <div className={customStyle.error}>{meta.error}</div>
        ) : (
          <div className={classes.error}>{meta.error}</div>
        )
      ) : null}
    </>
  );
};

export default TextInput;
