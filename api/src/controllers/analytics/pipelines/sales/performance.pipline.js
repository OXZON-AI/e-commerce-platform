export const performancePipeline = [
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
                  $let: {
                    vars: {
                      matchingVariant: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$variants",
                              as: "variant",
                              cond: {
                                $eq: ["$$variant._id", "$$item.variant"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$matchingVariant.cost",
                  },
                },
              ],
            },
          },
        },
      },
      "payment.amount": {
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
  {
    $addFields: {
      profit: {
        $subtract: ["$revenue", "$cost"],
      },
    },
  },
  {
    $project: {
      orderCount: {
        $ifNull: ["$orderCount", 0],
      },
      revenue: {
        $ifNull: ["$revenue", 0],
      },
      cost: {
        $ifNull: ["$cost", 0],
      },
      profit: {
        $ifNull: ["$profit", 0],
      },
      averageOrderValue: {
        $ifNull: ["$averageOrderValue", 0],
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
];
