export const buildCategoryTree = (categories) => {
  const findChildren = (parentId) => {
    return categories
      .filter((category) => {
        const categoryParent = category.parent
          ? category.parent.toString()
          : null;
        const searchParentId = parentId ? parentId.toString() : null;
        return categoryParent === searchParentId;
      })
      .map((category) => ({
        ...category,
        _id: category._id.toString(),
        parent: category.parent ? category.parent.toString() : null,
        children: findChildren(category._id),
      }));
  };

  const rootCategories = categories
    .filter((category) => category.parent === null)
    .map((category) => ({
      ...category,
      _id: category._id.toString(),
      children: findChildren(category._id),
    }));

  return rootCategories;
};
