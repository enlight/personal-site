import * as React from 'react';
import * as path from 'path';

const Sidebar: React.SFC<IHexoGlobalVars<{}>> = (props) => {
  const widgets = props.theme.widgets.map(widgetName => {
    const m = require(path.join(__dirname, 'sidebar_widgets', widgetName));
    return React.createElement(m.default, Object.assign({}, props, { key: widgetName }));
  });
  return <div id="sidebar">{widgets}</div>;
};

export default Sidebar;
