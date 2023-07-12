const {
  Category,
  FollowedCategory,
  BlockedCategory,
} = require("../models/Category");
const Keyword = require("../models/Keyword");
const News = require("../models/News");
const ShortNews = require("../models/ShortNews");
const User = require("../models/User");
const { ApiBadRequestError } = require("../utils/errors");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/mail");
const { fetchNews } = require("../newsScript");
const { default: slugify } = require("slugify");

var html_to_pdf = require("html-pdf-node");
class NewsService {
  async getInterestedNews(userId, category) {
    let ids;
    let _interested;
    let _notInterested;
    if (category) {
      let cat = await Category.findOne({ where: { title: category } });
      ids = cat.id;
    } else {
      _interested = (
        await FollowedCategory.findAll({ where: { userId } }, { raw: true })
      ).map((cat) => cat.categoryId);
      _notInterested = (
        await BlockedCategory.findAll({ where: { userId } }, { raw: true })
      ).map((cat) => cat.categoryId);
      console.log(_interested, _notInterested);
    }
    let news = News.findAll({
      where: {
        categoryId: category ? ids : _interested,
        categoryId: { [Op.notIn]: _notInterested },
      },
      order: [["pub_date", "DESC"]],
    });

    return news;
  }
  async getNewsById(newsId) {
    let news = await News.findByPk(newsId, {
      include: Keyword,
    });
    if (news) {
      return news;
    } else {
      throw new ApiBadRequestError("Invalid Event ID");
    }
  }

  async getShortNews() {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return await ShortNews.findAll({
      where: {
        date: { [Op.gte]: today },
      },
      order: [["createdAt", "DESC"]],
      limit: 9,
    });
  }

  async sendAllTopHeadlines() {
    let shortNews = await this.getShortNews();
    let HTMLShortNews = shortNews.map(
      (news) =>
        `<li>
        <h4><a href='${news.link}'>${news.title}<a></h4><br/> <small>${news.summary}</small>
      </li>`
    );

    let users = await User.findAll();
    let _promises = [];
    users.forEach((user) => {
      _promises.push(
        sendEmail(user.email, "News Headlines", `<ul> ${HTMLShortNews}</ul>`)
      );
    });
    Promise.all(_promises);
  }

  async getNewsByLocation(location) {
    console.log("inLOcation");
    let news = await News.findAll({
      where: { location: location },
      order: [[("createdAt", "DESC")]],
      limit: 4,
    });
    let today = new Date();
    today = today.setHours(today.getHours() - 5);

    if (news.length <= 0 || Date.parse(new Date(news[0]?.createdAt)) < today) {
      console.log("fecthing news");
      // await fetchNews({ location: location });
      return await News.findAll({
        where: { location: location },
        order: [[("createdAt", "DESC")]],
        limit: 4,
      });
    } else {
      return news;
    }
  }

  async createNews(user, data, file) {
    let _data = {
      slug: slugify(data.title),
      title: data.title,
      desc: data.desc,
      content: data.content,
      image_url: file.link,
      link: data.link,
      categoryId: 10,
      pub_date: new Date().toISOString(),
      country: data.location,
      keywords_str: data.keywords,
      location: data.location,
      isAdmin: true,
    };
    return await News.create(_data);
  }

  async printNewsByCategory(cat) {
    let news = await News.findAll({
      where: { categoryId: cat },
      order: [["createdAt", "DESC"]],
      limit: 9,
    });

    let options = { format: "A4" };
    // Example of options with args //
    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    //let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
    // or //
    //let file = { url: "https://google.com" };
    console.log("news got");
    let content = news.map(
      (news) =>
        `<li>
        <h4><a href='${news.link}'>${news.title}<a></h4><br/> <small>${news.desc}</small>
      </li>`
    );

    let template = `<body >
    <h1> News</h1>
    <p>Category</p>
    <ul>
      ${content}
      
      <ul>
      
  </body>`;
    let file = { content: template };
    let rslt = await html_to_pdf
      .generatePdf(file, options)
      .then((pdfBuffer) => {
        console.log("PDF Buffer:-", pdfBuffer);
        return pdfBuffer;
      });
    console.log(rslt);
    return rslt;
  }
}

module.exports = new NewsService();
