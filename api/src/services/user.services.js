import { User } from "../models/user.model.js";

export const createUser = async (
  email,
  password,
  name,
  phone,
  session = null
) => {
  const user = new User({
    email,
    password,
    name,
    phone,
  });

  return await user.save(session ? { session } : undefined);
};

export const getUser = async (options) => {
  return await User.findOne(options);
};
