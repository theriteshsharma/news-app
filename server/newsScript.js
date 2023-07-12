const fs = require("fs");
const News = require("./models/News");
const slugify = require("slugify");
const Keyword = require("./models/Keyword");
const { Category } = require("./models/Category");
const { TwitterApi } = require("twitter-api-v2");
const { default: axios } = require("axios");
const ShortNews = require("./models/ShortNews");

async function fetchFromNewsAPI(params) {
  // const courseFinder = JSON.parse(
  //   await readFile(new URL("./course-finder-2024.json", import.meta.url))
  // );
  // const data = JSON.parse(
  //   await fs.readFileSync("E:/Code/AurigaIT/news_app/Sample_Report.json")
  // );
  const data = await axios.get(
    `https://newsdata.io/api/1/news?apikey=pub_2575152a7e5539d7c43498f28a4ab55b28356&language=en&q=${
      params.location != undefined ? params.location : ""
    }`
  );
  return data.data;
}

async function fetchNews(params = {}) {
  console.log(params);
  const data = await fetchFromNewsAPI(params);
  // console.log(data);
  const curatedData = [];

  let keywords = {};
  let categories = {};
  let _key = await Keyword.findAll();
  let _categories = await Category.findAll();
  _key.forEach((key) => (keywords[key.title] = key.id));
  _categories.forEach((cat) => (categories[cat.title] = cat.id));

  let _promises = [];
  data.results.forEach(async (news) => {
    news.category.forEach(async (cat) => {
      if (!(cat in categories)) {
        categories[cat.toLowerCase()] = undefined;
        _promises.push(
          new Promise(async (resolve) => {
            Category.create({ title: cat.toLowerCase() }, { raw: true }).then(
              (rslt) => resolve(rslt.dataValues)
            );
          })
        );
      }
    });
  });
  let shortNews = [];
  Promise.all(_promises).then(async (value) => {
    console.log(value);
    value.forEach((val) => (categories[val.title] = val.id));
    console.log(categories);

    data.results.forEach(async (news) => {
      const _news = {
        slug: slugify(news.title),
        title: news.title,
        desc: news.description,
        content: news.content,
        image_url: news.image_url,
        video_url: news.video_url,
        link: news.link,
        pub_date: new Date(news.pubDate),
        country: news.country[0],
        langauge: news.language,
        categoryId: categories[news.category[0]],
        keywords_str: news.keywords?.join(";"),
        location: params.location != undefined ? params.location : "",
      };

      if (news.category[0] == "top") {
        shortNews.push({
          title: news.title,
          summary: news.description,
          slug: slugify(news.title),
          date: new Date(),
          link: news.link,
          category: news.category[2] ? news.category[2] : "top",
        });
      }

      curatedData.push(_news);
    });

    // Instantiate with desired auth type (here's Bearer v2 auth)
    // const client = new TwitterApi({
    //   appKey: "O5uvvVHX18m8W34YdO8voBDAg",
    //   appSecret: "wDl7YaybLRTihAVF3YftKP51YcgLh7Ld7maceV3Q8WoYkgLPKL",
    //   accessToken: "1114602961966002176-biYqqqgJzzpErXyMAzLh7Xwgio6YvZ",
    //   accessSecret: "wHCjNCRcN7araDHLD3eaTKqTxfOaC1QY8sEtMCiKPJM88",
    // });

    // const client = new TwitterApi(
    //   "AAAAAAAAAAAAAAAAAAAAAMyYogEAAAAAGHSCc682I%2BaEengJ6p0pHhhMFdM%3DD49YVC4lvzLFHyc5yydTgmzaIDBMugqCSAlUZpi4nrmEbK1NIw"
    // );

    await News.bulkCreate(curatedData, {
      updateOnDuplicate: ["title", "keywords_str"],
    });
    await ShortNews.bulkCreate(shortNews, {
      updateOnDuplicate: ["date"],
    });
  });

  // let allNews = await News.bulkCreate(curatedData);
  // allNews.forEach(news =>{

  // news.keywords?.forEach(async (cat) => {
  //   if (!(cat in keywords)) {
  //     let _rs = await Keyword.create({ title: cat });
  //     keywords[_rs.title] = _rs.id;
  //   }
  // });
}

module.exports = { fetchNews, fetchFromNewsAPI };
