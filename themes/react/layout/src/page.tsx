import * as React from 'react';
import BasePage from './base';

const Page: React.SFC<IHexoHelpers & IHexoGlobalVars<IHexoPageVars>> = (props) => {
  const { config, page } = props;
  return (
    <BasePage title={`${page.title} | ${config.title}`} {...props}>
      <div className="post">
        <h1 className="post-title">{page.title}</h1>
        <div className="post-content" dangerouslySetInnerHTML={
          {__html: page.content}
        }/>
      </div>
    </BasePage>
  );
};

export default Page;
