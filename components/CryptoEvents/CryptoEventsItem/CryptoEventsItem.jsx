import Image from 'next/image';

import Button from '../../shared/Button/Button';
import classes from './cryptoEventsItem.module.scss';

const CryptoEventsItem = ({ event }) => {
  return (
    <section className={classes['event-container']}>
      <section className={classes['event-container__information']}>
        <div className={classes['image-container']}>
          <Image src={`${event.cryptoImgSource}`} alt={`${event.title} image`} width={32} height={32} className={classes.image} />
        </div>

        <h3 className={classes.header}>{event.header}</h3>

        <h4 className={classes.date}> {event.date}</h4>

        <h4 className={classes.title}>{event.title}</h4>

        <p className={classes.body}>{event.body}</p>
      </section>

      <section className={classes['button-container']}>
        <a target='_blank' href={event.sourceLink} rel='noopener noreferrer'>
          <Button type='button' classType='small' value='SOURCE' />
        </a>
      </section>
    </section>
  );
};

export default CryptoEventsItem;
