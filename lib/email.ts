import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, link: string) {
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: to,
    subject: "Подтверждение регистрации",
    html: `
      <h2>Добро пожаловать!</h2>
      <p>Пожалуйста, подтвердите ваш email, кликнув по кнопке ниже:</p>
      <a href="${link}" style="
        display:inline-block;
        padding:12px 24px;
        background-color:#2563eb;
        color:white;
        border-radius:6px;
        text-decoration:none;
        margin-top:16px;
      ">Подтвердить email</a>
      <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
    `,
  });

  console.log("Отправка письма на", to, "с ссылкой:", link);
  console.log("Результат отправки:", error);

  if (error) throw new Error("Ошибка при отправке email");
}
