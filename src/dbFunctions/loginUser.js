const { pool } = require('../db/db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const loginUser = [
    body('email').isString().trim().escape().notEmpty().withMessage('O Email não pode estar vazio'),
    body('password').isString().trim().escape().notEmpty().withMessage('A Senha não pode estar vazia'),

    async (req, res) => {
        const errors = validationResult(req); // Verifica se houve erros de validação
        
        if (!errors.isEmpty()) {
            console.error('Erros de validação:', errors.array());
            return res.status(400).json({ errors: errors.array() }); // Retorna erro 400 com detalhes
        }

        const { email, password } = req.body;
        console.log(`Tentativa de login com o email: ${email}`);

        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                console.warn(`Email não encontrado: ${email}`);
                return res.status(401).json({ message: 'Email inválido' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                console.warn(`Senha inválida para o email: ${email}`);
                return res.status(401).json({ message: 'Senha inválida' });
            }

            console.log(`Login bem-sucedido para o email: ${email}`);
            res.status(201).json({ message: 'Usuário validado com sucesso' });
        } catch (err) {
            console.error('Erro interno no servidor:', err);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
];

module.exports = { loginUser };