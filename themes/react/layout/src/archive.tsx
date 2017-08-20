import * as React from 'react';
import BasePage from './base';
import Paginator from './components/paginator';
import { IHexoContext, IHexoCategoryPage, IHexoTagPage, IHexoArchivePage, IHexoPost } from './hexo';
import { isTagPage, isCategoryPage, isArchivePage } from './hexo_utils';

const ArchivePage: React.SFC<IHexoContext<IHexoCategoryPage | IHexoTagPage | IHexoArchivePage>> = (props) => {
  const { config, page, site, url_for, _ } = props;
  let title, readingLabel;
  if (isCategoryPage(page)) {
    title = page.category;
    readingLabel = `Reading articles in ${page.category}`;
  } else if (isTagPage(page)) {
    title = page.tag;
    readingLabel = `Reading articles in ${page.tag}`;
  } else if (isArchivePage(page)) {
    title = 'Archive';
  }
  const postsByYear = _.groupBy(site.posts.toArray(), (p: IHexoPost) => p.date.format('YYYY'));
  const posts: JSX.Element[] = [];
  for (let year in postsByYear) {
    posts.push(<h2 key={year}>{year}</h2>);
    posts.push(
      <ul className="listing" key={`${year}list`}>{
        postsByYear[year].map((post: IHexoPost) => (
          <li key={post.title}>
            <span className="date">{post.date.format('YYYY/MM/DD')}</span>
            <a href={url_for(post.path)} title={post.title}>{post.title}</a>
          </li>
        ))
      }</ul>
    );
  }

  return (
    <BasePage title={`${title} | ${config.title}`} {...props}>
      {readingLabel ? (<h1 className="label-title">{readingLabel}</h1>) : null}
      <div className="post">
        <div className="post-archive">
          {posts}
        </div>
      </div>
      {(page.next || page.prev) ? <Paginator {...props}/> : null}
    </BasePage>
  );
};

export default ArchivePage;
