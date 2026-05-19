import { BASE_URL, CONTACT } from "./mailer";

const base = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CFIA</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:IBM Plex Sans,Helvetica Neue,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#161616;padding:20px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.02em;">CFIA</span>
              <span style="color:#8d8d8d;font-size:12px;margin-left:12px;">Centro de Formação em IA</span>
            </td>
          </tr>

          <!-- Linha azul -->
          <tr><td style="background:#0f62fe;height:3px;"></td></tr>

          <!-- Conteúdo -->
          <tr>
            <td style="background:#ffffff;padding:40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f4;padding:24px 32px;border-top:1px solid #e0e0e0;">
              <p style="margin:0 0 4px;font-size:11px;color:#8d8d8d;">
                Este email foi enviado automaticamente. Não responda a este endereço.
              </p>
              <p style="margin:0;font-size:11px;color:#8d8d8d;">
                Dúvidas? Fale com a gente em
                <a href="mailto:${CONTACT}" style="color:#0f62fe;text-decoration:none;">${CONTACT}</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#c6c6c6;">
                © ${new Date().getFullYear()} CFIA · <a href="${BASE_URL}" style="color:#c6c6c6;text-decoration:none;">cfia.com.br</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export function welcomeEmail(name: string): { subject: string; html: string } {
  const firstName = name.split(" ")[0];
  return {
    subject: "Bem-vindo ao CFIA 🎓",
    html: base(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:300;color:#161616;letter-spacing:-0.01em;">
        Olá, ${firstName}!
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#525252;line-height:1.7;">
        Sua conta no <strong style="color:#161616;">CFIA</strong> foi criada com sucesso.
        Você agora tem acesso a cursos gratuitos de Inteligência Artificial, trilhas de carreira
        e uma comunidade ativa de estudantes e profissionais.
      </p>

      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
        <tr>
          <td style="padding:16px;background:#f4f4f4;border-left:3px solid #0f62fe;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#0f62fe;text-transform:uppercase;letter-spacing:0.1em;">Por onde começar</p>
            <ul style="margin:8px 0 0;padding:0 0 0 16px;font-size:13px;color:#525252;line-height:2;">
              <li>Explore os <a href="${BASE_URL}/cursos" style="color:#0f62fe;text-decoration:none;">cursos disponíveis</a></li>
              <li>Escolha uma <a href="${BASE_URL}/trilhas" style="color:#0f62fe;text-decoration:none;">trilha de carreira</a></li>
              <li>Participe da <a href="${BASE_URL}/comunidade" style="color:#0f62fe;text-decoration:none;">comunidade</a></li>
            </ul>
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#0f62fe;">
            <a href="${BASE_URL}/dashboard"
               style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
              Acessar meu painel →
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:32px 0 0;font-size:12px;color:#8d8d8d;border-top:1px solid #f4f4f4;padding-top:24px;">
        Você recebeu este email porque se cadastrou em <a href="${BASE_URL}" style="color:#0f62fe;text-decoration:none;">cfia.com.br</a>.
        Se não foi você, ignore esta mensagem.
      </p>
    `),
  };
}

export function passwordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  const firstName = name.split(" ")[0];
  return {
    subject: "Redefinição de senha — CFIA",
    html: base(`
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:300;color:#161616;letter-spacing:-0.01em;">
        Redefinir sua senha
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#525252;line-height:1.7;">
        Olá, ${firstName}. Recebemos uma solicitação para redefinir a senha da sua conta.
        Clique no botão abaixo para criar uma nova senha. Este link expira em <strong>1 hora</strong>.
      </p>

      <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#0f62fe;">
            <a href="${resetUrl}"
               style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
              Redefinir minha senha →
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-size:13px;color:#525252;">
        Se o botão não funcionar, copie e cole este link no navegador:
      </p>
      <p style="margin:0 0 24px;font-size:12px;word-break:break-all;">
        <a href="${resetUrl}" style="color:#0f62fe;text-decoration:none;">${resetUrl}</a>
      </p>

      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr>
          <td style="padding:16px;background:#fff8f1;border-left:3px solid #ff832b;">
            <p style="margin:0;font-size:12px;color:#525252;">
              <strong style="color:#161616;">Não solicitou a redefinição?</strong>
              Ignore este email — sua senha não será alterada.
              Por segurança, considere trocar sua senha se desconfiar de acesso não autorizado.
            </p>
          </td>
        </tr>
      </table>
    `),
  };
}

export function notificationEmail(name: string, message: string, link?: string): { subject: string; html: string } {
  const firstName = name.split(" ")[0];
  return {
    subject: `Nova notificação — CFIA`,
    html: base(`
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#0f62fe;text-transform:uppercase;letter-spacing:0.1em;">Notificação</p>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:300;color:#161616;">
        Olá, ${firstName}
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#525252;line-height:1.7;">
        ${message}
      </p>
      ${link ? `
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#0f62fe;">
            <a href="${BASE_URL}${link}"
               style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;">
              Ver na plataforma →
            </a>
          </td>
        </tr>
      </table>
      ` : ""}
    `),
  };
}
