const User = require("../models/User");
const { Op } = require("sequelize");
const { ApiBadRequestError } = require("../utils/errors");
const { compare, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify } = require("crypto");
const {
  Category,
  FollowedCategory,
  BlockedCategory,
} = require("../models/Category");

class UserServices {
  async register(user) {
    const [_user, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username: user.username }, { email: user.email }] },
      defaults: { ...user },
    });

    if (created) {
      return _user;
    } else {
      throw new ApiBadRequestError("User Already Exists");
    }
  }

  async signin(email, password) {
    let user = await User.findOne({
      where: { [Op.or]: [{ username: email }, { email: email }] },
    });

    if (user) {
      const rslt = await compareSync(password, user.password);
      if (rslt) {
        let token = jwt.sign(
          { uid: user.id, username: user.username, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        return {
          token,
          user: { username: user.username, isAdmin: user.isAdmin },
        };
      }
    }
    throw new ApiBadRequestError("Invalid Username or Password");
  }

  async addInterests(uid, { selected, blocked }) {
    let _selectedCategories = await Category.findAll({
      where: { id: selected },
    });
    let _blockedCategories = await Category.findAll({ where: { id: blocked } });

    if (
      _selectedCategories.length != selected.length ||
      _blockedCategories.length != blocked.length
    ) {
      throw new ApiBadRequestError("Invalid Category id");
    }

    await FollowedCategory.destroy({ where: { userId: uid } });
    await BlockedCategory.destroy({ where: { userId: uid } });

    let data = [];
    selected.forEach((cat) => {
      data.push({ userId: uid, categoryId: cat });
    });
    await FollowedCategory.bulkCreate(data, { ignoreDuplicates: true });

    data = [];
    blocked.forEach((cat) => {
      data.push({ userId: uid, categoryId: cat });
    });
    await BlockedCategory.bulkCreate(data, { ignoreDuplicates: true });
  }

  async getInterests(userId) {
    let interests = await FollowedCategory.findAll({
      where: { userId },
    });
    let blocked = await BlockedCategory.findAll({
      where: { userId },
    });

    return { interests, blocked };
  }
}

module.exports = new UserServices();
