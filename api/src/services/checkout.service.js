export const convertToPoints = (amount) => {
  const cap = process.env.POINTS_CAP;
  const points = amount / process.env.AMOUNT_TO_POINTS_RATE;

  return points > cap ? cap : points;
};

export const getDiscount = (points, amount) => {
  switch (true) {
    case points >= 1000 && amount >= 50:
      return { code: process.env.DISCOUNT_10, usedPoints: 1000 };
    case points >= 500 && amount >= 25:
      return { code: process.env.DISCOUNT_5, usedPoints: 500 };
    case points >= 200 && amount >= 10:
      return { code: process.env.DISCOUNT_2, usedPoints: 200 };
    default:
      return { code: undefined, usedPoints: 0 };
  }
};
