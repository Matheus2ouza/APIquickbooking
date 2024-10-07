const { pool } = require('../db/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const register = [
    body('username').isString().trim().escape().notEmpty().withMessage('o Usuario não pode estar vazio'),
    body('email').isString().trim().escape().notEmpty().withMessage('o Email não pode estar vazio'),
    body('password').isString().trim().escape().notEmpty().withMessage('o Password não pode estar vazio'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        console.log(`Request to register user: ${username}, email: ${email}`);

        try {
            const userExist = await pool.query('SELECT * from users WHERE username = $1', [username]);
            if (userExist.rows.length > 0) {
                console.warn(`Username já em uso: ${username}`);
                return res.status(400).json({ message: 'username já em uso' });
            }

            const emailExist = await pool.query('SELECT * from users WHERE email = $1', [email]);
            if (emailExist.rows.length > 0) {
                console.warn(`Email já em uso: ${email}`);
                return res.status(400).json({ message: 'email já em uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(`Dados aceitos... Cadastrando usuario`);

            const result = await pool.query('INSERT INTO users (username, email, password) VALUES($1, $2, $3)', 
                [username, email, hashedPassword]
            );
	    console.info('Usuario cadastrado com sucesso');
            res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
];

module.exports = { register };
