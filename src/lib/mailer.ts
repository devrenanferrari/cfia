import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER,   // nao-responda@cfia.com.br
    pass: process.env.SMTP_PASS,
  },
});

export const FROM = `"CFIA" <${process.env.SMTP_USER ?? "nao-responda@cfia.com.br"}>`;
export const CONTACT = "contato@cfia.com.br";
export const BASE_URL = process.env.NEXTAUTH_URL ?? "https://cfia.com.br";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({ from: FROM, to, subject, html });
}
