const validaor = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validaor.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validaor.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

module.exports = {
    validateSignUpData,
}