import * as React from 'react';

import { IHexoHelpers } from '../hexo';

interface IPaginatorProps {
  paginator: IHexoHelpers['paginator'];
}

const Paginator: React.SFC<IPaginatorProps> = (props) => {
  const { paginator } = props;
  return <nav className="page-navigator" dangerouslySetInnerHTML={
    {__html: paginator({prev_text: 'previous', next_text: 'next'})}
  }/>;
};

export default Paginator;
