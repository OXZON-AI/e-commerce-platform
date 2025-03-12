export const categoryPipeline = [
  {
    $unwind: {
      path: "$items",
    },
  },
  {
    $lookup: {
      from: "variants",
      localField: "items.variant",
      foreignField: "_id",
      as: "product",
      pipeline: [
        {
          $project: {
            _id: "$product",
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: "$product",
    },
  },
  {
    $lookup: {
      from: "products",
      localField: "product._id",
      foreignField: "_id",
      as: "category",
      pipeline: [
        {
          $project: {
            _id: "$category",
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: "$category",
    },
  },
  {
    $project: {
      _id: "$_id.date",
      category: "$_id.category",
      count: "$count",
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
      pipeline: [
        {
          $project: {
            slug: "$slug",
            name: "$name",
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: "$category",
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
  {
    $group: {
      _id: "$_id",
      categories: {
        $push: "$$ROOT",
      },
    },
  },
  {
    $project: {
      "categories._id": 0,
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
];
