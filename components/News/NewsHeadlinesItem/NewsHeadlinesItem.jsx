import Image from 'next/image';
import cn from 'classnames';

import Button from '../../shared/Button/Button';
import classes from './newsHeadlinesItem.module.scss';

const NewsHeadlinesItem = ({ headline }) => {
  if (headline.body) {
    return (
      <section className={cn(classes.container, classes['container--big'])}>
        <section className={classes['container__information']}>
          <section className={classes['container__image']}>
            <Image src={`${headline.imageLink}`} alt={`Article image`} width={440} height={220} />
          </section>

          <h3 className={classes.title}>{headline.title}</h3>

          <p className={classes.body}>{headline.body}</p>
        </section>

        <section className={classes['container__button']}>
          <a target='_blank' href={headline.articleLink} rel='noopener noreferrer'>
            <Button type='button' classType='small' value='READ MORE' />
          </a>
        </section>
      </section>
    );
  } else {
    return (
      <section className={cn(classes.container, classes['container--small'])}>
        <section className={classes['container__information']}>
          <section className={classes['container__image']}>
            <Image src={`${headline.imageLink}`} alt={`Article image`} width={320} height={180} />
          </section>

          <h3 className={classes.title}>{headline.title}</h3>
        </section>

        <section className={classes['container__button']}>
          <a target='_blank' href={headline.articleLink} rel='noopener noreferrer'>
            <Button type='button' classType='small' value='READ MORE' />
          </a>
        </section>
      </section>
    );
  }
};

export default NewsHeadlinesItem;
