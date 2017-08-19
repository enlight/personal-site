import * as React from 'react';
import BasePage from './base';
import Paginator from './components/paginator';

function getPostDescription(post: IHexoPost): JSX.Element | null {
  if (post.description) {
    return (<div className="post-content">{post.description}</div>);
  } else if (post.excerpt) {
    return (<div className="post-content">{post.excerpt}</div>);
  } else if (post.content) {
    const br = post.content.indexOf('\n');
    if (br < 0) {
      return (<div className="post-content">{post.content}</div>);
    } else {
      return (<div className="post-content">{post.content.substring(0, br)}</div>);
    }
  }
  return null;
}

interface IIndexPagePostProps {
  config: IHexoGlobalVars<IHexoIndexPageVars>['config'];
  post: IHexoPost;
  url_for: IHexoHelpers['url_for'];
  fa_icon: IHexoHelpers['fa_icon'];
}

const IndexPagePost: React.SFC<IIndexPagePostProps> = (props) => {
  const { config, post, url_for, fa_icon } = props;
  const description = getPostDescription(post);
  return (
    <div className="post post-index">
      <div className="post-meta post-index">{post.date.format(config.date_format)}</div>
      <h2 className="post-title post-index">
        <a href={url_for(post.path)}>{post.title}</a>
      </h2>
      {description ? (<div className="post-content">{description}</div>) : null}
      <p className="readmore">
        <a href={url_for(post.path)}>
          <span>Read More</span>
          <span dangerouslySetInnerHTML={
            {__html: fa_icon('angle-double-right', { width: '16px', height: '16px', ariaHidden: true })}
          }/>
        </a>
      </p>
    </div>
  );
};

const IndexPage: React.SFC<IHexoHelpers & IHexoGlobalVars<IHexoIndexPageVars>> = (props) => {
  const { config, page, site } = props;
  const posts = site.posts.toArray().map(post => <IndexPagePost post={post} {...props} key={post.path}/>);
  return (
    <BasePage title={config.title} {...props}>
      {posts}
      {(page.next || page.prev) ? <Paginator {...props}/> : null}
    </BasePage>
  );
};

export default IndexPage;
