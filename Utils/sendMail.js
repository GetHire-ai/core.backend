const nodemailer = require("nodemailer");

let sendMail = async (recipient, subject, text) => {

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Useremail,
      pass: process.env.GmailPass,
    },
  });

  let mailOptions = {
    from: `"GetHire.AI" <${process.env.Useremail}>`,
    to: recipient,
    subject: subject,
    text: text,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    // console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    if (error.response) {
      console.error("SMTP response: ", error.response);
    }
  }
};

module.exports = { sendMail };
