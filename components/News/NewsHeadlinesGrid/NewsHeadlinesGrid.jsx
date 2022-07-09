import NewsHeadlinesItem from '../NewsHeadlinesItem/NewsHeadlinesItem';
import classes from './newsHeadlinesGrid.module.scss';

const NewsHeadlinesGrid = ({ topHeadlines }) => {
  const headlinesWithBody = topHeadlines.filter((headline) => headline.body);
  const headlinesWithoutBody = topHeadlines.filter((headline) => !headline.body);

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>Top Headlines</h2>
      <section className={classes['container--big']}>
        {headlinesWithBody.map((headline) => (
          <NewsHeadlinesItem key={headline.id} headline={headline} />
        ))}
      </section>

      <section className={classes['container--small']}>
        {headlinesWithoutBody.map((headline) => (
          <NewsHeadlinesItem key={headline.id} headline={headline} />
        ))}
      </section>
    </section>
  );
};

export default NewsHeadlinesGrid;
