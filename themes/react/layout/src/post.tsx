import * as React from 'react';
import BasePage from './base';
import PageTags from './components/page_tags';
import PostNav from './components/post_nav';
import DisqusComments from './components/disqus_comments';

const PostPage: React.SFC<IHexoContext<IHexoPost>> = (props) => {
  const { theme, config, page, site } = props;
  return (
    <BasePage title={page.title + ' | ' + config.title} {...props}>
      <div className="post">
        <h1 className="post-title">{page.title}</h1>
        <div className="post-meta">{page.date.format('ll')}</div>
        <div className="post-content" dangerouslySetInnerHTML={
          {__html: page.content}
        }/>
        { page.tags ? <PageTags {...props}/> : null }
        { (page.next || page.prev) ? <PostNav {...props}/> : null }
        { theme.disqus ? <DisqusComments {...props}/> : null }
      </div>
    </BasePage>
  );
};

export default PostPage;