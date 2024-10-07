const { pool } = require('../db/db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const loginUser = [
    body('email').isString().trim().escape().notEmpty().withMessage('O Email n�o pode estar vazio'),
    body('password').isString().trim().escape().notEmpty().withMessage('A Senha n�o pode estar vazia'),

    async (req, res) => {
        const errors = validationResult(req); // Verifica se houve erros de valida��o
        
        if (!errors.isEmpty()) {
            console.error('Validation error:', errors.array());
            return res.status(400).json({ errors: errors.array() }); // Retorna erro 400 com detalhes
        }

        const { email, password } = req.body;
        console.log(`Attempt to login with email: ${email}`);

        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                console.warn(`Invalid email: ${email}`);
                return res.status(401).json({ message: 'Invalid email' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                console.warn(`Invalid password for email: ${email}`);
                return res.status(401).json({ message: 'Invalid password' });
            }

            console.info(`User successfully validated: ${email}`);
            res.status(201).json({ message: 'User successfully validated' });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

module.exports = { loginUser };