import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<boolean> {
    const url = `http://localhost:3000/auth/confirm/${token}`;

    const html = `
      <html>
        <head>
          <style>
            * {
              text-align: center;
              width: 100%;
            }

            header, main, footer {
              box-sizing: border-box;
              padding: 24px;

              text-align: center;

              background-color: #2e1305;
              color: #fadfd1;
            }

            header h1 {
              font-size: 32px;
              font-weight: 500;
            }

            header p {
              font-size: 24px;
              font-weight: 400;
            }

            main {
              background-color: #fadfd1;
              color: #2e1305;

              padding-bottom: 48px;
            }

            main h2 {
              font-size: 24px;
              font-weight: 500;
            }

            main p {
              font-size: 16px;
              font-weight: 400;
            }

            main a {
              font-size: 16px;
              font-weight: 700;
            }

            footer a, footer p {
              font-size: 12px;
              font-weight: 400;
            }

          </style>
        </head>
        <body>
          <header>
            <h1> CookieTop </h1>
            <p> Cozinhe, Crie, Compartilhe! </p>
          </header>

          <main>
            <h2> Olá, ${name}! </h2>
            <p> Seja muito bem vindo(a) ao CookieTop! </p>
            <p> Agradecemos o seu cadastro e esperamos que aproveite a experiência conosco. </p>
            <p> Precisamos apenas que nos confirme seu endereço de email. Para isso, basta clicar no botão abaixo: </p>

            <a href="${url}" style="display: inline-block; box-sizing: border-box; padding: 8px 16px; text-decoration: none; background-color: #d92662; color: #fadfd1;">Confirmar Email</a>
          </main>

          <footer>
            <p> Caso o botão não funcione, você também pode acessar o link: <a href="${url}" style="color: #d92662">${url}</a> </p>
            <p> Caso não tenha realizado esse cadastro, pedimos desculpas pelo inconveniente. Nesse caso, você pode ignorar este email. </p>
            <p> Qualquer cadastro realizado em seu nome sem devida confirmação será apagado de nosso banco em 24h. </p>
          </footer>
        </body>
      </html>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmação de Email',
        html,
      });

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
