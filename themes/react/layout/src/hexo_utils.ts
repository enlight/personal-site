export function isTagPage(page: IHexoAnyPageVars): page is IHexoTagPageVars {
  return (page as IHexoTagPageVars).tag ? true : false;
}

export function isCategoryPage(page: IHexoAnyPageVars): page is IHexoCategoryPageVars {
  return (page as IHexoCategoryPageVars).category ? true : false;
}

export function isArchivePage(page: IHexoAnyPageVars): page is IHexoArchivePageVars {
  return (page as IHexoArchivePageVars).archive ? true : false;
}
