const axios = require("axios");
const token = process.env.whatsAppToken
const whatsappId = process.env.whatsAppNumber_ID;
const Version = "v20.0";

let sendWhatsapp = async (recipientPhoneNumber, messageBody) => {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipientPhoneNumber,
    type: "text",
    text: {
      preview_url: false,
      body: messageBody,
    },
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${Version}/${whatsappId}/messages`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token} `,
        },
      }
    );
    console.log(response.data)
  } catch (error) {
    console.log(error.response.data);
  }
};

module.exports = { sendWhatsapp };
