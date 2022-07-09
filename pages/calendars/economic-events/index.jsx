// import Header from '../../../components/Calendar/Header/Header';
// import Table from '../../../components/Calendar/Table/Table';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// It disables SSR and lets you render new data on API call.
const Header = dynamic(() => import('../../../components/Calendar/Header/Header'), {
  ssr: false
});

const Table = dynamic(() => import('../../../components/Calendar/Table/Table'), {
  ssr: false
});

const headers = ['Event', 'Country', 'For', 'Reported', 'Expectation', 'Prior to this', 'Event time', 'Date'];

const EconomicEventsCalendarPage = (props) => {
  const [data, setData] = useState([]);
 
  return (
    <>
      <Header title='Economic Events Calendar' setData={setData} />
      <Table headers={headers} data={data} />
    </>
  );
};

EconomicEventsCalendarPage.auth = {
  role: 'user'
};

export default EconomicEventsCalendarPage;
