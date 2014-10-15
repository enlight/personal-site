#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Vadim Macagon'
SITENAME = u'Vadim Macagon'
SITEURL = ''

PATH = 'content'
# Static paths Pelican will copy without parsing.
STATIC_PATHS = ['images', 'extra/CNAME']
# Get Pelican to copy the CNAME to the output directory so the custom sub-domain
# works with GitHub Pages.
EXTRA_PATH_METADATA = {'extra/CNAME': {'path': 'CNAME'},}

TIMEZONE = 'Asia/Bangkok'
DEFAULT_LANG = u'en'

TYPOGRIFY = True
THEME = "themes/pelican-bootstrap3"

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
PAGE_URL = 'page/{slug}/'
PAGE_SAVE_AS = 'page/{slug}/index.html'
CATEGORY_URL = 'category/{slug}/'
CATEGORY_SAVE_AS = 'category/{slug}/index.html'
CATEGORIES_URL = 'categories/'
CATEGORIES_SAVE_AS = 'categories/index.html'
TAG_URL = 'tag/{slug}/'
TAG_SAVE_AS = 'tag/{slug}/index.html'
TAGS_URL = 'tags/'
TAGS_SAVE_AS = 'tags/index.html'
ARCHIVES_URL = 'archives/'
ARCHIVES_SAVE_AS = 'archives/index.html'

# Only one author, so no need for these.
AUTHOR_SAVE_AS = ''
AUTHORS_SAVE_AS = ''

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

TAG_CLOUD_STEPS = 4

