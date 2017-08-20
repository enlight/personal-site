import { Moment } from 'moment';
import * as lodash from 'lodash';

interface IMenuItem {
  page: string;
  directory: string;
}

interface IThemeLink {
  title: string;
  text: string;
  icon: string;
  url: string;
}

// Interface for the theme config in _config.yml
interface IThemeConfig {
  menu: IMenuItem[];
  // Widgets to be display in the sidebar.
  widgets: string[];
  // Social links to display in the sidebar.
  links: IThemeLink[];
  // Sub-directory that contains .css files.
  css: string;
  // True if Disqus comments should be displayed.
  disqus: boolean;
}

// Interface for the site config (_config.yml in the project root)
interface ISiteConfig {
  title: string;
  subtitle: string;
  description: string;
  language: string;
  url: string;
  date_format: string;
}

interface IHexoSite {
  title: string;
  posts: { toArray: () => IHexoPost[] };
}

interface IHexoContext<TPageVars> extends IHexoHelpers {
  site: IHexoSite;
  page: TPageVars;
  config: ISiteConfig;
  theme: IThemeConfig;
  _: typeof lodash;
}

interface IHexoTag {
  name: string;
  path: string;
}

interface IHexoPage {
  title?: string;
  description?: string;
  date: Moment;
  content: string;
  excerpt?: string;
  path: string;
  prev: this | null;
  next: this | null;
}

interface IHexoPost extends IHexoPage {
  tags: { toArray: () => IHexoTag[] };
}

interface IHexoIndexPage {
  next: number;
  prev: number;
}

interface IHexoArchivePage extends IHexoIndexPage {
  archive: true;
}

interface IHexoCategoryPage extends IHexoIndexPage {
  category: string;
}

interface IHexoTagPage extends IHexoIndexPage {
  tag: string;
}

type IHexoAnyPage = IHexoPage | IHexoPost | IHexoIndexPage | IHexoArchivePage | IHexoCategoryPage | IHexoTagPage;

interface IHexoHelpers {
  url_for(path: string): string;
  
  // conditional tags

  // Returns True if the path matches the URL of the current page.
  is_current(path: string): boolean;
  // Returns True if the current page is the home page.
  is_home(): boolean;
  // Returns True if the current page is a post.
  is_post(): boolean;
  // Returns True if the current page is an archive page.
  is_archive(): boolean;
  // Returns True if the current page is a category page.
  is_category(): boolean;
  // Returns True if the current page belongs to the given category.
  is_category(categoryName: string): boolean;
  // Returns True if the current page is a tag page.
  is_tag(): boolean;
  // Returns True if the current page has the given tag.
  is_tag(tagName: string): boolean;

  // Creates an element containing a list of posts.
  list_posts(options: {
    amount: number;
  }): string;
  // Creates a tag cloud element.
  tagcloud(options: {
    min_font: number;
    max_font: number;
    unit: 'px' | 'em';
    amount: number;
    orderby: 'name' | 'count';
  }): string;

  paginator(options: {
    prev_text?: string;
    next_text?: string;
  }): string;

  // custom helpers
  fa_icon(symbol: string, options: object): string;
}
