'use strict'

const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Module = require('module');

function compile(template) {
  const m = require(template.path);
  const component = m.__esModule ? m.default : m;

  return (locals) => {
    const element = React.createElement(component, locals);
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    if (markup.startsWith('<html')) {
      return '<!DOCTYPE html>\n' + markup;
    }

    return markup;
  }
}

function renderer(data, locals) {
  return compile(data)(locals);
}

renderer.compile = compile;

hexo.extend.renderer.register('js', 'html', renderer, true);
