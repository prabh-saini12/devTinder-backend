const { validateEditProfileData } = require("../utils/validation");

const GetProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const EditProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({
        success: false,
        message: "Invalid edit",
      });
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    return res.status(200).json({
      success: true,
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { GetProfile, EditProfile };
