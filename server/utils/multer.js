const multer = require("multer");

const path = require("path");
const { ApiBadRequestError } = require("./errors");
let config;
let fileBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.FILE_BASE_URL
    : `http://${process.env.HOST}:4000/images/`;

config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    let name =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    file.link = fileBaseUrl + name;
    cb(null, name);
  },
});

const fileUpload = multer({
  storage: config,
  //TODO: file Filter

  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|JPG|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new ApiBadRequestError("Please Upload A Image"));
    }

    cb(undefined, true);
  },
});

module.exports = { fileUpload };
