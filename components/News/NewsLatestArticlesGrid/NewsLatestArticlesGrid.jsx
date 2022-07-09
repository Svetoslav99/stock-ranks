import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import NewsLatestArticlesItem from '../NewsLatestArticlesItem/NewsLatestArticlesItem';
import classes from './newsLatestArticlesGrid.module.scss';

import hostAddr from '../../../utils/determine-environment';

const NewsLatestArticlesGrid = ({ latestArticles, allDataLength }) => {
  const [skip, setSkip] = useState(8);
  const [items, setItems] = useState(latestArticles);
  const [hasMore, setHasMore] = useState(true);

  console.log(items.length);

  const fetchMoreData = async () => {
    // load more data from fetch call
    const res = await fetch(`${hostAddr}/api/news-latest-articles`, {
      method: 'POST',
      body: JSON.stringify({
        skip: skip,
        take: 8
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    setSkip(skip + 8);

    const { data } = await res.json();
    console.log('items: ', items);
    console.log('data: ', data);

    // check if you already have them and if you do - only add the ones you don`t have and the rest - nope and make a setHasMore(false)
    let newArrOfArticles = [...items, ...data];

    const articlesId = newArrOfArticles.map((item) => item.id);
    const hasDuplicate = articlesId.some((item, idx) => articlesId.indexOf(item) !== idx);

    if (hasDuplicate) {
      newArrOfArticles = newArrOfArticles.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id && t.title === value.title));

      console.log('duplicate found!');
      setHasMore(false);
    }

    // sort everything by scraped data timestamp
    newArrOfArticles = newArrOfArticles.sort((a, b) => {
      console.log('new Date(a.scrapedTimestamp).toISOString(): ', new Date(a.scrapedTimestamp).toISOString());
      console.log('new Date(b.scrapedTimestamp).toISOString(): ', new Date(b.scrapedTimestamp).toISOString());
      return new Date(b.scrapedTimestamp).toISOString() - new Date(a.scrapedTimestamp).toISOString();
    });

    // newArrOfArticles = newArrOfArticles.sort((a, b) => {
    //   return a.id - b.id;
    // });

    // console.log('newArrOfArticles: ', newArrOfArticles);

    setItems(newArrOfArticles);

    if (items.length === allDataLength) {
      setHasMore(false);
    }
  };

  return (
    <section className={classes.container}>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
        scrollableTarget='scrollable'
        height={'84vh'}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>There are no more news in the database!</b>
          </p>
        }
      >
        <h2 className={classes.title}>Latest articles</h2>
        <section className={classes['container--grid']} id='scrollable'>
          {items.map((article) => (
            <NewsLatestArticlesItem key={article.id} article={article} />
          ))}
        </section>
      </InfiniteScroll>
    </section>
  );
};

export default NewsLatestArticlesGrid;
