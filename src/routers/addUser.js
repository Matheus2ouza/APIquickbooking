const { pool } = require('../db/dbP');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const register = [
    body('username').isString().trim().escape().notEmpty().withMessage('O usuário não pode estar vazio'),
    body('email').isEmail().normalizeEmail().notEmpty().withMessage('O email não pode estar vazio'),
    body('password').isString().trim().escape().notEmpty().withMessage('A senha não pode estar vazia'),

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
                return res.status(400).json({ message: 'username already in use' });
            }

            // Verifica se o email já está cadastrado
            const emailExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (emailExist.rows.length > 0) {
                return res.status(400).json({ message: 'Email is already in use' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insere o usuário na tabela 'users'
            const userResult = await pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
                [username, email, hashedPassword]
            );

            // Insere o token na tabela 'tokens_verificacao'
            await pool.query(
                'INSERT INTO tokens_verificacao (users_id, token, data_expiracao) VALUES ($1, $2, $3)',
                [userId, token, expiresAt]
            );
            console.log(`Registered user ${username}`)
            return res.status(201).json({ message: 'Registered user...'});
        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
];

module.exports = { register };
