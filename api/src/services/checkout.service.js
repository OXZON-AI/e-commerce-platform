export const convertToPoints = (amount) => {
  const cap = process.env.POINTS_CAP;
  const points = amount / process.env.AMOUNT_TO_POINTS_RATE;

  return points > cap ? cap : points;
};

export const getDiscount = (points, amount) => {
  switch (true) {
    case points >= process.env.CASE1_POINTS &&
      amount >= process.env.CASE1_AMOUNT:
      return {
        code: process.env.DISCOUNT_10,
        usedPoints: process.env.CASE1_POINTS,
      };
    case points >= process.env.CASE2_POINTS &&
      amount >= process.env.CASE2_AMOUNT:
      return {
        code: process.env.DISCOUNT_5,
        usedPoints: process.env.CASE2_POINTS,
      };
    case points >= process.env.CASE3_POINTS &&
      amount >= process.env.CASE3_AMOUNT:
      return {
        code: process.env.DISCOUNT_2,
        usedPoints: process.env.CASE3_POINTS,
      };
    default:
      return { code: undefined, usedPoints: 0 };
  }
};
