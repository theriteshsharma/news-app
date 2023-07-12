let nodemailer = require("nodemailer");

let configOptions = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASS,
  },
};

let transporter = nodemailer.createTransport(configOptions);

const sendEmail = async (to, subject, body) => {
  if (process.env.NODE_ENV === "production" || true) {
    let msg = await transporter.sendMail({
      to,
      subject,

      html: `
      <html> <body>
      ${body}
      </body></html>
      `,

      from: process.env.GMAIL_ID,
    });
    console.log(msg);
  } else {
    console.log(to, body);
  }
  //   console.log("msg", msg);
};

module.exports = { sendEmail };
