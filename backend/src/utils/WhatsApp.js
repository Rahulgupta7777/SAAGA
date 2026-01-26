import axios from "axios";

export const sendWhatsappOtp = async (to, otpCode) => {
  // DEVELOPMENT BYPASS: If credentials are not set, log OTP and return success
  if (
    !process.env.WHATSAPP_PHONE_ID ||
    process.env.WHATSAPP_PHONE_ID.includes("dashboard")
  ) {
    console.log(`[DEV MODE] Mock WhatsApp OTP to ${to}: ${otpCode}`);
    return { success: true, message: "Mock OTP sent" };
  }

  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "91" + to, // Adds India country code automatically
        type: "template",
        template: {
          name: "auth_otp", // Remember THIS MATCHES YOUR TEMPLATE NAME IN DASHBOARD, at last 
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: otpCode }, // Replaces {{1}} in template
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [
                { type: "text", text: otpCode }, // For the "Copy Code" button
              ],
            },
          ],
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    // Don't crash the app, but let the user know validation failed
    throw new Error(
      "WhatsApp service temporarily unavailable. Please try again later.",
    );
  }
};
