const express = require('express');
const bodyParser = require('body-parser');
const { checkDatabaseConnection } = require('./src/db/dbP');
const { register } = require('./src/routers/addUser');
const { loginUser } = require('./src/routers/loginUser');
const { company } = require('./src/routers/registerCompany')
const path = require('path');

require('dotenv').config();

const app = express();

app.use('LOGO VETORIZADA sem fundo.png', express.static(path.join(__dirname, 'img', 'LOGO VETORIZADA sem fundo.png')));

app.use(bodyParser.json());

const cors = require('cors');

app.use(cors({
    origin: '*', 
    methods: 'GET,POST', 
    allowedHeaders: 'Content-Type'
}));

app.use((req, res, next) => {
    console.info(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

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

checkDatabaseConnection();

// Rotas
app.post('/register', register);
app.post('/loginUser', loginUser);
app.post('/company', company)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`Servidor rodando com sucesso na porta ${port}...`);
});
