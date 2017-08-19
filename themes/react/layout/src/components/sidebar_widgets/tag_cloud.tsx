import * as React from 'react';

interface ITagCloudWidgetProps {
  tagcloud: IHexoHelpers['tagcloud'];
}

const TagCloudWidget: React.SFC<ITagCloudWidgetProps> = (props) => {
  const { tagcloud } = props;
  return (
    <div className="widget">
      <div className="widget-title">tags</div>
      <div className="tagcloud" dangerouslySetInnerHTML={
        {__html: tagcloud({min_font: 1, max_font: 1, unit: 'em', amount: 10, orderby: 'count'})}
      }/>
    </div>
  );
};

export default TagCloudWidget;
