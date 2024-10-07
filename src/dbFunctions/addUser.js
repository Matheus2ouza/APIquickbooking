const { pool } = require('../db/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const register = [
    body('username').isString().trim().escape().notEmpty().withMessage('o Usuario n�o pode estar vazio'),
    body('email').isString().trim().escape().notEmpty().withMessage('o Email n�o pode estar vazio'),
    body('password').isString().trim().escape().notEmpty().withMessage('o Password n�o pode estar vazio'),

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
                console.warn(`username already in use: ${username}`);
                return res.status(400).json({ message: 'username already in use' });
            }

            const emailExist = await pool.query('SELECT * from users WHERE email = $1', [email]);
            if (emailExist.rows.length > 0) {
                console.warn(`Email already in use: ${email}`);
                return res.status(400).json({ message: 'email already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(`Data accepted... Registering user`);

            const result = await pool.query('INSERT INTO users (username, email, password) VALUES($1, $2, $3)', 
                [username, email, hashedPassword]
            );
	    console.info('User registered successfully');
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
];

module.exports = { register };
