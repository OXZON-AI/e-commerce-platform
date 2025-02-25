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
          $addFields: {
            items: {
              $map: {
                input: "$items",
                as: "item",
                in: {
                  variant: "$$item.variant",
                  quantity: "$$item.quantity",
                  subTotal: "$$item.subTotal",
                  cost: {
                    $multiply: [
                      "$$item.quantity",
                      {
                        $arrayElemAt: [
                          {
                            $let: {
                              vars: {
                                matchingVariant: {
                                  $filter: {
                                    input: "$variants",
                                    as: "variant",
                                    cond: {
                                      $eq: ["$$variant._id", "$$item.variant"],
                                    },
                                  },
                                },
                              },
                              in: "$$matchingVariant.cost",
                            },
                          },
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $addFields: {
            cost: {
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: {
                  $cond: {
                    if: {
                      $eq: ["$status", "cancelled"],
                    },
                    then: "$$value",
                    else: {
                      $add: ["$$value", "$$this.cost"],
                    },
                  },
                },
              },
            },
          },
        },
      ],
      averageOrderValue: [
        {
          $addFields: {
            "payment.amount": {
              $cond: {
                if: {
                  $eq: ["$status", "cancelled"],
                },
                then: 0,
                else: "$payment.amount",
              },
            },
          },
        },
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
        $sum: "$costs.cost",
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
      orderCount: { $ifNull: ["$count", 0] },
      revenue: { $ifNull: ["$revenue", 0] },
      cost: { $ifNull: ["$cost", 0] },
      profit: { $ifNull: ["$profit", 0] },
      averageOrderValue: {
        $ifNull: ["$averageOrderValue", 0],
      },
    },
  },
];
