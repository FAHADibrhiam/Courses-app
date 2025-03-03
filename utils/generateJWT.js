const jwt = require("jsonwebtoken");
module.exports = async (payload) => {
  const NewToken = await jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
    expiresIn: "1d",
  });
  return NewToken;
};
