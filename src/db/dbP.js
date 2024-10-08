// src/db/db.js
const fs = require('fs');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

const checkDatabaseConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        client.release();
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
};

module.exports = { pool, checkDatabaseConnection };
