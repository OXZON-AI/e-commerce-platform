import { User } from "../models/user.model.js";

export const createUser = async (email, password, name, phone) => {
  const user = new User({
    email,
    password,
    name,
    phone,
  });

  return await user.save();
};

export const getUser = async (email) => {
  return await User.findOne({ email });
};
