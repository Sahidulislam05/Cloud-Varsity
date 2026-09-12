import ejs from "ejs";
import path from "node:path";
import config from "../config";
import { transporter } from "../lib/nodemailer";

export const sendTemplatedEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, unknown>,
) => {
  try {
    const html = await ejs.renderFile(
      path.join(process.cwd(), "src/app/templates", `${templateName}.ejs`),
      data,
    );
    await transporter.sendMail({
      from: config.email_sender,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send "${templateName}" email:`, error);
  }
};
