import CryptoEventsGrid from './CryptoEventsGrid/CryptoEventsGrid';

import classes from './cryptoEvents.module.scss';

const CryptoEvents = ({cryptoEvents}) => {
    
  return (
    <>
      <section className={classes['crypto-events']}>
        <h2>Upcoming events top 100 coins by marketcap</h2>
        <CryptoEventsGrid events={cryptoEvents} />
      </section>
    </>
  );
};

export default CryptoEvents;