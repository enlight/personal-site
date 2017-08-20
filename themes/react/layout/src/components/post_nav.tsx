import * as React from 'react';
import { IHexoHelpers, IHexoPost } from '../hexo';

interface IPostNavProps {
  page: IHexoPost;
  url_for: IHexoHelpers['url_for'];
  fa_icon: IHexoHelpers['fa_icon'];
}

const PostNav: React.SFC<IPostNavProps> = (props) => {
  const { page, url_for, fa_icon } = props;
  const prevPage = page.prev &&
    <a href={url_for(page.prev.path)} className="pre"
      dangerouslySetInnerHTML={
        {__html: fa_icon('caret-left', { width: '16px', height: '16px', ariaHidden: true }) + page.prev.title}
      }
    />;
  const nextPage = page.next &&
    <a href={url_for(page.next.path)} className="next"
      dangerouslySetInnerHTML={
        {__html: page.next.title + fa_icon('caret-right', { width: '16px', height: '16px', ariaHidden: true })}
      }
    />;
  return (
    <div className="post-nav">
      { prevPage }
      { nextPage }
    </div>
  );
};

export default PostNav;
