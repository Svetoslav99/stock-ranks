import Head from 'next/head';
import NewsLatestArticlesGrid from '../../../components/News/NewsLatestArticlesGrid/NewsLatestArticlesGrid';

import hostAddr from '../../../utils/determine-environment';

const Index = ({ latestArticles, allDataLength }) => {
  return (
    <>
      <Head>
        <title>Latest News</title>
        <meta name='description' content='See all the latest news around the world.' />
      </Head>
      <NewsLatestArticlesGrid latestArticles={latestArticles} allDataLength={allDataLength} />
    </>
  );
};

export async function getStaticProps() {
  const res = await fetch(`${hostAddr}/api/news-latest-articles`, {
    method: 'POST',
    body: JSON.stringify({
      skip: 0,
      take: 8
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const { data } = await res.json();

  const resCountData = await fetch(`${hostAddr}/api/news-latest-articles`, {
    method: 'POST',
    body: JSON.stringify({
      takeAll: true
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const resultCount = await resCountData.json();

  return {
    props: {
      latestArticles: data,
      allDataLength: resultCount.dataLength
    },
    revalidate: 120 // 60 sec * 2 min
  };
}

Index.auth = {
  role: 'user'
};

export default Index;
