import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import Image from 'next/image';
import moment from 'moment';

import { useState } from 'react';

import classes from './header.module.scss';

const Header = (props) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [chosenDateRange, setChosenDateRange] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  let initialSelection = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  };

  const [range, setRange] = useState(initialSelection);

  const handleSelect = (ranges) => {
    setRange(ranges.selection);
    console.log('range: ', range);
    initialSelection = range;
  };

  const submitSelection = async () => {
    setCalendarOpen(false);

    const startDate = range.startDate;
    const endDate = range.endDate;

    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

    setChosenDateRange({ startDate: formattedStartDate, endDate: formattedEndDate });

    let currentDate = formattedStartDate;
    const dateArray = [];

    if (startDate === endDate) {
      dateArray.push(currentDate);
    } else {
      while (moment(currentDate).isSameOrBefore(moment(formattedEndDate))) {
        dateArray.push(currentDate);
        currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
      }
    }

    setLoading(true);
    setError('');

    const res = await fetch('/api/calendars-data', {
      method: 'POST',
      body: JSON.stringify({
        dates: dateArray,
        calendar: props.title
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (data?.error) {
      setError(data.message);
      props.setData([]);
    } else {
      props.setData(data.data);
    }
    setLoading(false);
  };

  return (
    <>
      <header className={classes.container__header}>
        <h2 className={classes.title}>{props.title}</h2>

        <div className={classes.container__calendar}>
          <h3>Pick a date from the calendar</h3>
          <div className={classes.container__calendar_picker}>
            <Image src='/icons/40/calendar-black.svg' alt='Calendar image' width={36} height={36} onClick={() => setCalendarOpen(!calendarOpen)} className={classes.pointer} />
            {calendarOpen && (
              <div className={classes['container__calendar_picker--inner']}>
                <DateRangePicker className={classes['date-range-picker']} ranges={[range]} onChange={handleSelect} />
                <button onClick={submitSelection}>Search</button>
              </div>
            )}
          </div>

          {error && <h4 className={classes.error}>{error}</h4>}
        </div>
        <div className={classes['container__picked-date-range']}>
          {chosenDateRange && (
            <h4>
              Loaded data from <b className={classes.date}>{chosenDateRange.startDate}</b> to <b className={classes.date}>{chosenDateRange.endDate}.</b>
            </h4>
          )}
          {loading && <h4 className={classes.loading}>Loading...</h4>}
        </div>
      </header>
    </>
  );
};

export default Header;
