// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

'use strict';

// Hexo helper that generates an inline SVG for a FontAwesome icon.
// Based on the same concept used by GitHub: https://github.com/blog/2112-delivering-octicons-with-svg

/**
 * Callback will be called with an array of objects containing the following properties:
 * - code: unicode character code,
 * - name: special name, if provided,
 * - ref: name or code
 * - svg:  full svg content required to render the character
 * - path: just the path from the svg content
 *
 * This function is based on one by the same name implemented in
 * https://github.com/eugene1g/font-blast 
 *
 * @param fontSvgText SVG font definition containing all characters.
 * @param charCodeToNameMap Map of character codes to human readable names.
 * @param callback
 */
function extractCharsFromFont(fontSvgText, charCodeToNameMap/*, callback*/) {
    //const svgo = require('svgo');
    const { DOMParser } = require('xmldom');

    const domParser = new DOMParser();
    var doc = domParser.parseFromString(fontSvgText, 'text/xml').documentElement,
        fontSpec = doc.getElementsByTagName('font')[0],
        defaultCharWidth = fontSpec.getAttribute('horiz-adv-x'),
        fontFace = doc.getElementsByTagName('font-face')[0],
        defaultCharHeight = fontFace.getAttribute('units-per-em'),
        defaultCharAscent = fontFace.getAttribute('ascent'),

        glyphs = doc.getElementsByTagName('glyph'),

        //"square" fonts tend to be based at the center (like glyphicon)
        //white other fonts tend to be based around the charAscent mark
        //so wen need to flip them with different adjustments
        translateOffset = defaultCharAscent,//(defaultCharWidth == defaultCharHeight ? defaultCharHeight : defaultCharAscent),
        iconSvg = [],
        charMap = charCodeToNameMap || {};


    for (var glyphCount = 0; glyphCount < glyphs.length; glyphCount++) {
        var glyph = glyphs.item(glyphCount);
        //some strange fonts put empty glyphs in them
        if (!glyph) continue;
        var iconCode = glyph.getAttribute('unicode'),
            pathData = glyph.getAttribute('d'),
            customWidthMatch = glyph.getAttribute('horiz-adv-x'),
            contentWidth = customWidthMatch ? customWidthMatch : defaultCharWidth;

        // some glyphs matched without a unicode value so we should ignore them
        if (!iconCode) continue;

        if (iconCode.indexOf('&#') != -1) {
            iconCode = iconCode.replace("&#x", "");
        }

        if (iconCode.length == 1) {
            iconCode = iconCode.charCodeAt(0).toString(16);
        }

        // skip empty-looking glyphs
        if (!iconCode.length || !pathData || pathData.length < 10) continue;

        var name = charMap[iconCode] || glyph.getAttribute('glyph-name') || iconCode;

        iconSvg.push({
            name: name,
            path: pathData,
            viewBox: { x: 0, y: 0, width: contentWidth, height: defaultCharHeight },
            yOffset: translateOffset
        });
    }
    return iconSvg;

    // Optimize all SVG to remove viewBox and compress the data path
    /*
    let optimizedCount = 0;
    const optimizer = new svgo();
    iconSvg.forEach((ic, idx) => {
        optimizer.optimize(ic.svg, result => {

            // override SVG and path details with the clean result
            iconSvg[idx].svg = result.data;
            iconSvg[idx].path = result.data.match(/d="(.*?)"/)[1];

            if (++optimizedCount == iconSvg.length) {
                callback(iconSvg);
            }
        });
    });
    */
}

let svgCache = null;

function loadSVGFont(fontFile, metaFile) {
    const fs = require('fs');
    const metaFileContent = fs.readFileSync(metaFile, 'utf-8');
    const svgFileContent = fs.readFileSync(fontFile, 'utf-8');
    const yaml = require('js-yaml');
    const metaData = yaml.safeLoad(metaFileContent).icons;
    const charCodeToNameMap = {};
    metaData.forEach(icon => {
        charCodeToNameMap[icon.unicode] = icon.id;
    });
    const icons = extractCharsFromFont(svgFileContent, charCodeToNameMap);
    svgCache = new Map();
    icons.forEach(icon => svgCache.set(icon.name, icon));
}

function svgPropsToMarkup(props) {
  return (
    `<svg name="${props.name}" class="fa"` +
          ` viewBox="${props.viewBox.x} ${props.viewBox.y} ${props.viewBox.width} ${props.viewBox.height}"` +
          `${props.width ? ` width="${props.width}"` : ''}` +
          `${props.height ? ` height="${props.height}"` : ''}` +
          `${props.ariaHidden ? ` aria-hidden="true"` : ''}>` +
       `<g transform="scale(1,-1) translate(0,-${props.yOffset})"><path d="${props.path}"/></g>` +
     '</svg>'
  );
}

/**
 * For example, this:
 * 
 * <%- fa_icon('plus', { width: '16px', height: '16px', ariaHidden: true }) %>
 * 
 * Will be replaced by:
 * 
 * <svg name="plus" class="fa" width="16px" height="16px" aria-hidden="true">
 *   <path d="..."></path>
 * </svg>
 */

function inlineFontAwesomeIcon(symbol, options) {
  if (!svgCache) {
    const path = require('path');
    const { svg, yml } = hexo.config.font_awesome_icons;
    const svgFile = path.join(hexo.base_dir, svg);
    const ymlFile = path.join(hexo.base_dir, yml);
    loadSVGFont(svgFile, ymlFile);
  }
  const svgProps = svgCache.get(symbol);
  if (svgProps) {
    return svgPropsToMarkup(Object.assign({}, svgProps, options));
  } else {
    return '';
  }
}

// TODO: Don't run this when the module is loaded, this should run at a more appropriate time,
//       perhaps when Hexo emits one of its events. 
// The only way to add an icon to the output of the default renderer of anchors is to use a font,
// to use inline SVGs gotta hijack the default anchor renderer in `hexo-renderer-markdown-it` and
// replace it with a custom one.
if (hexo.config.markdown && hexo.config.markdown.anchors) {
  const assign = require('lodash.assign');
  const Token = require('markdown-it/lib/token');
  const MarkdownIt = require('markdown-it');
  const md = new MarkdownIt({
    html: true,
    xhtmlOut: false,
    breaks: false,
    linkify: false,
    typographer: false
  });
  hexo.config.markdown.anchors.renderPermalink = function (slug, opts, tokens, idx) {
    const svgMarkup = inlineFontAwesomeIcon(
      opts.permalinkSymbol, { width: '16px', height: '16px', ariaHidden: true }
    );
    // Feed the inline SVG to the Markdown parser to get a list of tokens that represent it,
    // then inject those tokens into a link element, and inject the link element into the
    // heading element.
    // 
    // md.parse() will actually generate an array of 3 tokens from the SVG markup
    // (<p>,<svg/>,</p>), but only the children of the <svg/> seem to directly correspond
    // to the SVG markup.  
    const svgTokens = md.parse(svgMarkup, {})[1].children;
    // tokens[idx] is the "heading_open" token that corresponds to the start tag of the heading
    // element, but the tokens that represent the content of the heading element are actually
    // stored in tokens[idx + 1].children.
    tokens[idx + 1].children.unshift(
      assign(new Token('link_open', 'a', 1), {
        attrs: [['class', opts.permalinkClass], ['href', '#' + slug]]
      }),
      ...svgTokens,
      new Token('link_close', 'a', -1)
    );
  };
}

// TODO: register a tag plugin so that icons can be inserted in markdown documents
hexo.extend.helper.register('fa_icon', inlineFontAwesomeIcon);
