const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o pacote CORS
const { checkDatabaseConnection } = require('./db/db');
const { register } = require('./dbFunctions/addUser');
const { loginUser } = require('./dbFunctions/loginUser');
require('dotenv').config();

const app = express();

// Habilite CORS
app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// Cabeçalhos de Segurança
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
    next();
});

// Verificar conexão com o banco de dados ao iniciar o servidor
checkDatabaseConnection();

// Rotas
app.post('/register', register);
app.post('/loginUser', loginUser);

// Carregue a chave e o certificado SSL
const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
};

// Iniciar o servidor HTTPS
const port = process.env.PORT;
https.createServer(options, app).listen(port, () => {
    console.log(`Servidor rodando com sucesso...`);
});
