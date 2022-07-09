import { useState, useEffect } from 'react';
import cn from 'classnames';

import classes from './table.module.scss';

const Table = (props) => {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  });

  return (
    <>
      <main className={classes.container__main}>
        <section className={classes.container__table}>
          <table className={classes.table}>
            <thead>
              <tr className={classes.tr}>
                {props.headers.map((header) => (
                  <th key={header} className={classes.th}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={classes.tbody}>
              {data.length !== 0
                ? data.map((obj) => {
                    return (
                      <tr key={obj.id} className={classes['tr--tbody']}>
                        {Object.keys(obj).map((key) => {
                          if (key === 'id') return;

                          let specClass = '';
                          switch (key) {
                            case 'symbolEarnings':
                              specClass = 'td--symbol__earnings-calendar';
                              break;
                            case 'companyEarnings':
                              specClass = 'td--company__earnings-calendar';
                              break;
                            case 'earningsCallTimeEarnings':
                              specClass = 'td--earnings-call-time__earnings-calendar';
                              break;
                            case 'EPSEstimateEarnings':
                              specClass = 'td--eps-estimate__earnings-calendar';
                              break;
                            case 'reportedEPSEarnings':
                              specClass = 'td--reported-eps__earnings-calendar';
                              break;
                            case 'surpriseEarnings':
                              specClass = 'td--surprise__earnings-calendar';
                              break;
                            case 'dateEarnings':
                              specClass = 'td--date__earnings-calendar';
                              break;
                            case 'symbolIPOs':
                              specClass = 'td--symbol__ipos-calendar';
                              break;
                            case 'companyIPOs':
                              specClass = 'td--company__ipos-calendar';
                              break;
                            case 'exchangeIPOs':
                              specClass = 'td--exchange__ipos-calendar';
                              break;
                            case 'dateIPOs':
                              specClass = 'td--date__ipos-calendar';
                              break;
                            case 'eventEconomicEvent':
                              specClass = 'td--event__economic-event-calendar';
                              break;
                            case 'countryEconomicEvent':
                              specClass = 'td--country__economic-event-calendar';
                              break;
                            case 'forEconomicEvent':
                              specClass = 'td--for__economic-event-calendar';
                              break;
                            case 'reportedEconomicEvent':
                              specClass = 'td--reported__economic-event-calendar';
                              break;
                            case 'expectationEconomicEvent':
                              specClass = 'td--expectation__economic-event-calendar';
                              break;
                            case 'priorToThisEconomicEvent':
                              specClass = 'td--prior-to-this__economic-event-calendar';
                              break;
                            case 'eventTimeEconomicEvent':
                              specClass = 'td--event-time__economic-event-calendar';
                              break;
                            case 'dateEconomicEvent':
                              specClass = 'td--date__economic-event-calendar';
                              break;
                          }

                          if (
                            (key === 'EPSEstimateEarnings' ||
                              key === 'reportedEPSEarnings' ||
                              key === 'surpriseEarnings' ||
                              key === 'reportedEconomicEvent' ||
                              key === 'expectationEconomicEvent' ||
                              key === 'priorToThisEconomicEvent') &&
                            obj[key].includes('-') &&
                            obj[key].length > 1
                          ) {
                            return (
                              <td key={Math.random() + obj.id.substring(0, 7)} className={cn(classes[specClass], classes.negative)}>
                                {obj[key]}
                              </td>
                            );
                          }

                          if (
                            (key === 'EPSEstimateEarnings' ||
                              key === 'reportedEPSEarnings' ||
                              key === 'surpriseEarnings' ||
                              key == 'reportedEconomicEvent' ||
                              key === 'expectationEconomicEvent' ||
                              key === 'priorToThisEconomicEvent') &&
                            !obj[key].includes('-')
                          ) {
                            return (
                              <td key={Math.random() + obj.id.substring(0, 7)} className={cn(classes[specClass], classes.positive)}>
                                {obj[key]}
                              </td>
                            );
                          }

                          return (
                            <td key={Math.random() + obj.id.substring(0, 7)} className={classes[specClass]}>
                              {obj[key]}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                : // <tr>
                  //   <td colSpan='7'> No data</td>
                  // </tr>
                  ''}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export default Table;
