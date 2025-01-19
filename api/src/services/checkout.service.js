export const convertToPoints = (amount) => {
  const cap = process.env.POINTS_CAP;
  const points = amount / process.env.AMOUNT_TO_POINTS_RATE;

  return points > cap ? cap : points;
};

export const getDiscountCode = (points, amount) => {
  switch (true) {
    case points >= 1000 && amount >= 50:
      return process.env.DISCOUNT_10;
    case points >= 500 && amount >= 25:
      return process.env.DISCOUNT_5;
    case points >= 200 && amount >= 10:
      return process.env.DISCOUNT_2;
    default:
      return null;
  }
};
