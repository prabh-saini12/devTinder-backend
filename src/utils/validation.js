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

const validateEditProfileData = (req) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    allowedEdits.includes(key)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
