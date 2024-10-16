const { pool } = require('../db/dbP');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { requiredField } = require('./registerCompany')

const register = [
    requiredField('username'),
    requiredField('email'),
    requiredField('password'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // Verifica se o nome de usuário já existe
            const userExist = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            if (userExist.rows.length > 0) {
                console.log(`${username} já esta em uso`)
                return res.status(401).json({ message: 'username already in use' });
            }
            
            // Verifica se o email já está cadastrado
            const emailExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (emailExist.rows.length > 0) {
                console.log(`${email} já esta em uso`)
                return res.status(401).json({ message: 'Email is already in use' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insere o usuário na tabela 'users' e retorna o id do user
            const userResult = await pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
                [username, email, hashedPassword]
            );
            //extrai o id do user
            const userId = userResult.rows[0].id; 
            console.log(`Registered user ${username}`)
            console.log(`Id do user ${userId}`)
            return res.status(201).json({ message: 'Registered user...', userId});
        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
];

module.exports = { register };
