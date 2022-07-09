import { useState } from 'react';
import dynamic from 'next/dynamic';

// It disables SSR and lets you render new data on API call.
const Header = dynamic(() => import('../../../components/Calendar/Header/Header'), {
  ssr: false
});

const Table = dynamic(() => import('../../../components/Calendar/Table/Table'), {
  ssr: false
});

const headers = ['Symbol', 'Company', 'Earnings Call Time', 'EPS Estimate', 'Reported EPS', 'Surprise(%)', 'Date'];

const EarningsCalendarPage = () => {
  const [data, setData] = useState([]);

  return (
    <>
      <Header title='Earnings Calendar' setData={setData} />
      <Table headers={headers} data={data} />
    </>
  );
};

EarningsCalendarPage.auth = {
  role: 'user'
};

export default EarningsCalendarPage;
