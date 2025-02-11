import { Category } from "../models/category.model.js";

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

export const getIdsForDelete = async (parent) => {
  const idsForDelete = [parent];
  let queue = [parent];

  while (queue.length) {
    let currentParent = queue.pop();

    const children = await Category.find({ parent: currentParent }, { _id: 1 });

    if (children.length) {
      const childIds = children.map((child) => child._id.toString());
      idsForDelete.push(...childIds);
      queue.push(...childIds);
    }
  }

  return idsForDelete;
};
