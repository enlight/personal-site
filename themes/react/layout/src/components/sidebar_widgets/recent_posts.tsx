import * as React from 'react';

interface IRecentPostsWidgetProps {
  list_posts: IHexoHelpers['list_posts'];
}

const RecentPostsWidget: React.SFC<IRecentPostsWidgetProps> = (props) => {
  const { list_posts } = props;
  return (
    <div className="widget">
      <div className="widget-title">recent posts</div>
      <div dangerouslySetInnerHTML={
        {__html: list_posts({amount: 10})}
      }/>
    </div>
  );
};

export default RecentPostsWidget;
