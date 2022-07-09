import CryptoEventsItem from '../CryptoEventsItem/CryptoEventsItem';

import classes from './cryptoEventsGrid.module.scss';

const CryptoEventsGrid = ({ events }) => {

  return (
    <main className={classes.container}>
      {events.map((event) => (
        <CryptoEventsItem key={event.id} event={event} />
      ))}
    </main>
  );
};

export default CryptoEventsGrid;
