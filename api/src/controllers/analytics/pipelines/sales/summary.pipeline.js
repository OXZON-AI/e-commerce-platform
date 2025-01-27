export const summaryPipeline = [
  {
    $facet: {
      ordersCount: [
        {
          $count: "count",
        },
      ],
      revenue: [
        {
          $group: {
            _id: null,
            sum: {
              $sum: {
                $cond: {
                  if: {
                    $ne: ["$status", "cancelled"],
                  },
                  then: "$payment.amount",
                  else: 0,
                },
              },
            },
          },
        },
      ],
      costs: [
        {
          $lookup: {
            from: "variants",
            localField: "items.variant",
            foreignField: "_id",
            as: "variants",
          },
        },
        {
          $project: {
            totalCost: {
              $sum: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$variants",
                              as: "variant",
                              cond: {
                                if: {
                                  $eq: ["$$variant._id", "$$item.variant"],
                                },
                              },
                            },
                          },
                          as: "variant",
                          in: {
                            $cond: {
                              if: {
                                $ne: ["$status", "cancelled"],
                              },
                              then: {
                                $multiply: [
                                  "$$variant.cost",
                                  "$$item.quantity",
                                ],
                              },
                              else: 0,
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      ],
      averageOrderValue: [
        {
          $group: {
            _id: null,
            amount: {
              $avg: "$payment.amount",
            },
          },
        },
      ],
    },
  },
  {
    $project: {
      count: {
        $arrayElemAt: ["$ordersCount.count", 0],
      },
      revenue: {
        $arrayElemAt: ["$revenue.sum", 0],
      },
      cost: {
        $sum: "$costs.totalCost",
      },
      averageOrderValue: {
        $arrayElemAt: ["$averageOrderValue.amount", 0],
      },
    },
  },
  {
    $addFields: {
      profit: {
        $subtract: ["$revenue", "$cost"],
      },
    },
  },
  {
    $project: {
      count: { $ifNull: ["$count", 0] },
      revenue: { $ifNull: ["$revenue", 0] },
      cost: { $ifNull: ["$cost", 0] },
      profit: { $ifNull: ["$profit", 0] },
      averageOrderValue: {
        $ifNull: ["$averageOrderValue", 0],
      },
    },
  },
];
