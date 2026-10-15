import jwt from "jsonwebtoken";

const generateToken = async (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

export default generateToken;