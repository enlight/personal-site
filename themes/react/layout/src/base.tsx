import * as path from 'path';
import * as React from 'react';
import Sidebar from './components/sidebar';
import { IHexoContext } from './hexo';

const NavMenu: React.SFC<IHexoContext<{}>> = (props) => {
  const { theme, url_for, is_home, is_post, is_current, is_tag, is_category } = props;
  const items = theme.menu.map(item => {
    const url = url_for(item.directory)
    if ((item.directory === '.' && (is_home() || is_post())) || is_current(item.directory))
      return <a className="current" href={url} key={item.page}>{item.page}</a>;
    else if (item.directory === 'archives/' && (is_tag() || is_category()))
      return <a className="current" href={url} key={item.page}>{item.page}</a>;
    else
      return <a href={url} key={item.page}>{item.page}</a>;
  });
  return <div id="nav-menu">{items}</div>;
};

interface IPageHeaderProps extends IHexoContext<{}> {
  currentTitle: string;
}

const PageHeader: React.SFC<IPageHeaderProps> = (props) => {
  const { theme, config, url_for } = props;
  return (
    <div id="header">
      <div className="site-name">
        <a id="logo" href={url_for('.')}>{config.title}</a>
        <p className="description">{config.subtitle}</p>
      </div>
      <NavMenu {...props} />
    </div>
  );
};

const PageFooter: React.SFC<IHexoContext<{}>> = (props) => {
  const { url_for, config } = props;
  return (
    <div id="footer">
      {"© 2014-2016 "}
      <a href={url_for('.')} rel="nofollow">{config.title + '.'}</a>
      {" Powered by "}
      <a rel="nofollow noopener noreferrer" target="_blank" href="https://hexo.io">Hexo.</a>
      {" Theme based on "}
      <a rel="nofollow noopener noreferrer" target="_blank" href="https://github.com/tufu9441/maupassant-hexo">a theme by Cho.</a>
    </div>
  );
};

const Rocket: React.SFC = (props) => <a id="rocket" className="show" href="#top"/>;

interface IBasePageProps extends IHexoContext<any> {
  title: string;
}

const BasePage: React.SFC<IBasePageProps> = (props) => {
  const { config, theme, page, site, url_for } = props;
  const currentTitle = page.title || page.tag || page.category || site.title;
  return (
    <html lang={config.language}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />
        {/*
          By default, Safari on iOS detects any string formatted like a phone number and makes it a
          link that calls the number. This disables that behavior.
        */}
        <meta content="telephone=no" name="format-detection" />
        <meta name="description" content={config.description} />
        <title>{props.title}</title>
        <link rel="stylesheet" type="text/css" href={url_for(theme.css) + '/normalize.min.css'} />
        <link rel="stylesheet" type="text/css" href={url_for(theme.css) + '/pure-min.css'} />
        <link rel="stylesheet" type="text/css" href={url_for(theme.css) + '/grids-responsive-min.css'} />
        <link rel="stylesheet" type="text/css" href={url_for(theme.css) + '/style.css'} />
        <link rel="stylesheet" type="text/css" href={url_for(theme.css) + '/codemirror.css'} />
        <link rel="Shortcut Icon" type="image/x-icon" href={url_for('favicon.ico')} />
        <link rel="apple-touch-icon" href={url_for('apple-touch-icon.png')} />
        <link rel="apple-touch-icon-precomposed" href={url_for('apple-touch-icon.png')} />
      </head>
      <body className="body_container">
        <PageHeader currentTitle={currentTitle} {...props} />
        <div id="layout" className="pure-g">
          <div className="pure-u-1 pure-u-md-3-4">
            <div className="content_container">
              {props.children}
            </div>
          </div>
          <div className="pure-u-1-4 hidden_mid_and_down">
            <Sidebar {...props} />
          </div>
          <div className="pure-u-1 pure-u-md-3-4">
            <PageFooter {...props} />
          </div>
        </div>
        <Rocket />
      </body>
    </html>
  );
};

export default BasePage;
