import * as React from 'react';

interface IPageTagsProps {
  page: IHexoPost;
  url_for: IHexoHelpers['url_for'];
  fa_icon: IHexoHelpers['fa_icon'];
}

const PageTags: React.SFC<IPageTagsProps> = (props) => {
  const { page, url_for, fa_icon } = props;
  const tags = page.tags.toArray().map(tag => {
    return <a href={url_for(tag.path)} key={tag.name} dangerouslySetInnerHTML={
      {__html: fa_icon('tag', { width: '16px', height: '16px', ariaHidden: true }) + tag.name}
    }/>
  });
  return (<div className="tags">{tags}</div>);
};

export default PageTags;
