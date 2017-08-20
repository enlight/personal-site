import * as React from 'react';
import * as path from 'path';
import { IHexoContext } from '../hexo';

const Sidebar: React.SFC<IHexoContext<{}>> = (props) => {
  const widgets = props.theme.widgets.map(widgetName => {
    const m = require(path.join(__dirname, 'sidebar_widgets', widgetName));
    return React.createElement(m.default, Object.assign({}, props, { key: widgetName }));
  });
  return <div id="sidebar">{widgets}</div>;
};

export default Sidebar;
