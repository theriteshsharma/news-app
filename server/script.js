const { fetchNews } = require("./newsScript");

(async () => {
  await fetchNews();
  console.log("SOmething");
})();
