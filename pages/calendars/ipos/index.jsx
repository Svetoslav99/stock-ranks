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

const headers = ['Symbol', 'Company', 'Exchange', 'Date'];

const IPOsCalendarPage = () => {
  const [data, setData] = useState([]);

  return (
    <>
      <Header title='IPOs Calendar' setData={setData} />
      <Table headers={headers} data={data} />
    </>
  );
};

IPOsCalendarPage.auth = {
  role: 'user'
};

export default IPOsCalendarPage;
