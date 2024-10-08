const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Sua chave da API do SendGrid

const sendVerificationEmail = async (email, verificationLink) => {
    const msg = {
        to: email,
        from: 'quickbooking.org@gmail.com', // Substitua pelo seu email
        subject: 'Verifique seu Email - QuickBooking',
        html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verificação de Email - QuickBooking</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center; /* Centraliza o contêiner horizontalmente */
                        height: 97vh; /* Altura total da tela */
                        margin: 0; /* Remove margens padrão */
                        font-family: Helvetica, Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }

                    .container {
                        padding: 20px;
                        text-align: left; /* Alinha o texto à esquerda dentro do contêiner */
                        width: 100%; /* O contêiner ocupa 100% da largura */
                        max-width: 500px; /* Limita a largura do contêiner para evitar que fique muito largo */
                        box-sizing: border-box; /* Inclui padding e border na largura total */
                        background: white; /* Fundo branco */
                        border-radius: 5px; /* Cantos arredondados */
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra do contêiner */
                    }

                    .title {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #1f6dae;
                        cursor: pointer;
                        text-decoration: none;
                    }

                    button {
                        background-color: #1f6dae; /* Cor do botão */
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                    }

                    a {
                        word-wrap: break-word; /* Permite que o link quebre em várias linhas se for muito longo */
                        overflow-wrap: break-word; /* Alternativa para garantir que links longos não saiam do contêiner */
                        color: blue; /* Adiciona cor ao link */
                        text-decoration: underline; /* Adiciona sublinhado ao link */
                        display: block; /* Faz o link ocupar toda a largura do contêiner, se necessário */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <a class="title" href="https://youtu.be/2bqm4gRY3mA?si=2kr5nhIClXdlp6LC">QuickBooking</a>
                    <p>${email}</p>
                    <p>Ainda falta um passo para ativar a sua conta QuickBooking. Clique no botão abaixo para confirmar o seu endereço de email:</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar o meu email</a>
                    <p>Não funcionou? Copie o link abaixo no seu navegador:</p>
                    <a href="${verificationLink}">${verificationLink}</a>
                    <p>Atenciosamente,<br>Equipe QuickBooking</p>
                    <p>QuickBooking 2024</p>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Email de verificação enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
};

module.exports = { sendVerificationEmail };