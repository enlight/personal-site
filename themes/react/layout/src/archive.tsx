import * as React from 'react';
import BasePage from './base';
import Paginator from './components/paginator';
import { isTagPage, isCategoryPage, isArchivePage } from './hexo_utils';

/*
extends base

block title
  if page.category
     title= page.category + ' | ' + config.title
  if page.tag
     title= page.tag + ' | ' + config.title
  if page.archive
     title= __('archive') + ' | ' + config.title
block content
  if page.category || page.tag
      h1.label-title=  __('reading_label', page.category || page.tag)
  .post
    .post-archive
        //Use lodash to classify posts. See https://lodash.com/docs#groupBy
        each posts, year in _.groupBy(page.posts.toArray(), function(p){return -p.date.format('YYYY')})
          h2= -year
          ul.listing
            for post in posts
              li
                span.date= post.date.format('YYYY/MM/DD')
                a(href=url_for(post.path), title=post.title)
                  +title(post)
  include _partial/paginator.jade
*/

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
