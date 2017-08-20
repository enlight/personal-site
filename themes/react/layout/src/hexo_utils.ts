import { IHexoAnyPage, IHexoTagPage, IHexoCategoryPage, IHexoArchivePage } from './hexo';

export function isTagPage(page: IHexoAnyPage): page is IHexoTagPage {
  return (page as IHexoTagPage).tag ? true : false;
}

export function isCategoryPage(page: IHexoAnyPage): page is IHexoCategoryPage {
  return (page as IHexoCategoryPage).category ? true : false;
}

export function isArchivePage(page: IHexoAnyPage): page is IHexoArchivePage {
  return (page as IHexoArchivePage).archive ? true : false;
}
