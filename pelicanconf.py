#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Vadim Macagon'
SITENAME = u'Vadim Macagon'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'Asia/Bangkok'
DEFAULT_LANG = u'en'

TYPOGRIFY = True
THEME = "themes/pelican-bootstrap3"

# Settings specific to the pelican-bootstrap3 theme
BOOTSTRAP_THEME = 'readable'
DISPLAY_CATEGORY_IN_BREADCRUMBS = True
# display date and tags under the title of each article on the index page
DISPLAY_ARTICLE_INFO_ON_INDEX = True
# display tag cloud instead of as a list
DISPLAY_TAGS_INLINE = True
DISPLAY_CATEGORIES_ON_SIDEBAR = True
# this will display a list of github repos in the sidebar
#GITHUB_USER = 'enlight'
#GITHUB_SHOW_USER_LINK = True

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
#LINKS = (('Pelican', 'http://getpelican.com/'),
#         ('Python.org', 'http://python.org/'),
#         ('Jinja2', 'http://jinja.pocoo.org/'),
#         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('twitter', 'http://twitter.com/macagonator'),
          ('github', 'https://github.com/enlight'),
		  ('bitbucket', 'https://bitbucket.org/enlight'),)

GITHUB_URL = 'https://github.com/enlight'

# Disable pagination
DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
