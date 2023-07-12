const { Category } = require("../models/Category");

class CategoryService {
  async getAll() {
    let cat = await Category.findAll({
      include: { model: Category, as: "parent" },
    });

    return cat;
  }
}

module.exports = new CategoryService();
