import Image from 'next/image';
import cn from 'classnames';

import classes from './newsLatestArticlesItem.module.scss';

const NewsLatestArticlesItem = ({ article }) => {
  return (
    <section className={cn(classes.container, classes['container--small'])}>
      <section className={classes['container__information']}>
        <section className={classes['container__image']}>
          <Image src={`${article.imageLink}`} alt={`Article image`} width={320} height={180} />
        </section>

        <section className={classes['container--flex']}>
          <p className={cn(classes['body--small'], classes['align--left'])}>{article.uploadedArticleTimestamp}</p>
          <p className={cn(classes['body--small'], classes['align--right'])}>{article.author}</p>
        </section>

        <h3 className={classes.title}>{article.title}</h3>
      </section>

      <section className={classes['container__button']}>
        <a target='_blank' href={article.articleLink} rel='noopener noreferrer'>
          <button className={classes.button}>READ MORE</button>
        </a>
      </section>
    </section>
  );
};

export default NewsLatestArticlesItem;
