const { pool } = require('../db/db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const loginUser = [
    body('email').isString().trim().escape().notEmpty().withMessage('O Email n�o pode estar vazio'),
    body('password').isString().trim().escape().notEmpty().withMessage('A Senha n�o pode estar vazia'),

    async (req, res) => {
        const errors = validationResult(req); // Verifica se houve erros de valida��o
        
        if (!errors.isEmpty()) {
            console.error('Erros de valida��o:', errors.array());
            return res.status(400).json({ errors: errors.array() }); // Retorna erro 400 com detalhes
        }

        const { email, password } = req.body;
        console.log(`Tentativa de login com o email: ${email}`);

        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                console.warn(`Email n�o encontrado: ${email}`);
                return res.status(401).json({ message: 'Email inv�lido' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                console.warn(`Senha inv�lida para o email: ${email}`);
                return res.status(401).json({ message: 'Senha inv�lida' });
            }

            console.log(`Login bem-sucedido para o email: ${email}`);
            res.status(201).json({ message: 'Usu�rio validado com sucesso' });
        } catch (err) {
            console.error('Erro interno no servidor:', err);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
];

module.exports = { loginUser };