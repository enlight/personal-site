import * as React from 'react';

const SearchWidget: React.SFC<IHexoGlobalVars<{}>> = (props) => {
  const { config } = props;
  return (
    <div className="widget">
      <form action="//www.google.com/search" method="get" acceptCharset="utf-8" className="search-form" target="_blank">
        <input type="text" name="q" maxLength={20} placeholder="Search" />
        <input type="hidden" name="sitesearch" value={config.url} />
      </form>
    </div>
  );
};

export default SearchWidget;
