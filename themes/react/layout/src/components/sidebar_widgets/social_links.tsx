import * as React from 'react';
import { IHexoHelpers, IHexoContext } from '../../hexo';

interface ISocialLinksWidgetProps {
  theme: IHexoContext<{}>['theme'];
  fa_icon: IHexoHelpers['fa_icon'];
}

const SocialLinksWidget: React.SFC<ISocialLinksWidgetProps> = (props) => {
  const { theme, fa_icon } = props;
  const links = theme.links.map(link => {
    return (
      <li className="color-on-hover" key={link.title}>
        <a href={link.url} rel="noopener noreferrer" title={link.title} target="_blank"
          dangerouslySetInnerHTML={
            {__html: fa_icon(link.icon, { width: '16px', height: '16px', ariaHidden: true }) + link.text}
          }/>
      </li>
    );
  });
  return (
    <div className="widget">
      <div className="widget-title">social</div>
      <ul>{links}</ul>
    </div>
  );
};

export default SocialLinksWidget;
