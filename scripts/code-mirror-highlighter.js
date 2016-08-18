// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

'use strict';

// Hexo filter that perform syntax highlighting of code using Code Mirror.

const stripIndent = require('strip-indent');
var CodeMirror = require('codemirror/addon/runmode/runmode.node.js');
require('codemirror/mode/meta.js');

/**
 * `escapeHtml` borrowed from https://github.com/component/escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */
const htmlRegExp = /["'&<>]/;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML.
 * @return {string}
 */
function escapeHtml(string) {
  var str = '' + string;
  var match = htmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

/**
 * @param code Source code to format.
 * @param lang Programming language the code is written in.
 * @param theme Name of a Code Mirror theme, if not specified will be set to `default`.
 * @param showLineNumbers Specifies whether or not line numbers should be inserted into the output.
 * @return HTML markup that can be inserted into a document.
 */
function highlight(code, lang, theme, showLineNumbers) {
  let modeName = lang;
  let mimeType = lang;
  CodeMirror.modeInfo.forEach(info => {
    if ((info.name.toLowerCase() === lang) || (info.alias && info.alias.includes(lang))) {
      modeName = info.mode;
      mimeType = info.mime;
    }
  });

  if (!CodeMirror.modes[modeName]) {
    require('codemirror/mode/' + modeName + '/' + modeName + '.js');
  }

  let gutterLines = [];
  let codeLines = [];
  let curLine = '';
  let curStyle = null;
  // used to accumulate tokens that share the same style
  let accum = '';

  function flush() {
    if (curStyle) {
      const cmStyle = curStyle.replace(/(^|\s+)/g, '$1cm-');
      curLine += `<span class="${cmStyle}">${escapeHtml(accum)}</span>`;
    } else {
      curLine += escapeHtml(accum);
    }
  }

  function emitLine() {
    flush();
    codeLines.push(`<div class="line">${curLine}</div>`);
    gutterLines.push(`<div class="line">${showLineNumbers ? (codeLines.length) : ''}</div>`);
  }

  CodeMirror.runMode(code, mimeType, (text, style) => {
    if (text === '\n') {
      emitLine();
      // prep for a new line
      curLine = '';
      accum = '';
      curStyle = style;
      return;
    }
    if (style !== curStyle) {
      flush();
      curStyle = style;
      accum = text;
    } else {
      accum += text;
    }
  });

  if ((curLine !== '') || (accum !== '')) {
    emitLine();
  }

  return (
    `<figure class="highlight">
       <table>
         <tbody>
           <tr>
             <td class="gutter">
               <pre>${gutterLines.join('')}</pre>
             </td>
             <td class="code">
               <pre class="cm-s-${theme || 'default'}">${codeLines.join('')}</pre>
             </td>
           </tr>
         </tbody>
       </table>
     </figure>`
  );
}

const rBacktick = /(\s*)(`{3,}|~{3,}) *(.*) *\n([\s\S]+?)\s*\2(\n+|$)/g;
const rLangCaption = /([^\s]+)\s*(.+)?/;

/**
 * Hexo filter function that perform syntax highlighting of code using Code Mirror.
 * The code to be highlighted must be enclosed in a block delimited by
 * triple back-ticks (```) or triple tildes (~~~), the programming language the code is written in
 * must be specified after the opening delimiter, for example:
 * 
 * ```cpp
 * int main(int argc, void** argv)
 * {
 *   return 0;
 * }
 * ```
 * 
 * ~~~javascript
 * main(argc, argv)
 * {
 *   return 0;
 * }
 * ~~~
 * 
 * The following settings in your site _config.yml affect how code is processed:
 * 
 * highlight:
 *   enable: false ## disable default code highlighter
 * code_mirror:
 *   enable: true ## enable the Code Mirror highlighter
 *   theme: default ## set the Code Mirror theme to use, be sure to include the appropriate `.css`
 *   line_number: true ## toggle display of line numbers
 */
function backtickCodeBlock(data) {
  var config = this.config.code_mirror || {};
  if (!config.enable) return;

  data.content = data.content.replace(rBacktick, function() {
    var start = arguments[1];
    var end = arguments[5];
    var args = arguments[3];
    var content = arguments[4];

    let lang = '';

    if (args) {
      var match;
      if (rLangCaption.test(args)) {
        const match = args.match(rLangCaption);
        if (match) {
          lang = match[1];
        }
      }
    }

    content = highlight(stripIndent(content), lang, config.theme, config.line_number);
    return start + content + (end ? '\n\n' : '');
  });
}

hexo.extend.filter.register('before_post_render', backtickCodeBlock);
