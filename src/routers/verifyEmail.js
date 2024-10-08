const { pool } = require('../db/dbP');

const verifyEmail = async (req, res) => {
    const { token, id } = req.query;

    try {
        // Verifica se o token existe e ainda é válido
        const tokenResult = await pool.query(
            'SELECT * FROM tokens_verificacao WHERE users_id = $1 AND token = $2 AND data_expiracao > NOW()',
            [id, token]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Atualiza o status do email para verificado
        await pool.query('UPDATE users SET email_verificado = true WHERE id = $1', [id]);

        // Remove o token de verificação da tabela
        await pool.query('DELETE FROM tokens_verificacao WHERE users_id = $1', [id]);

        return res.status(200).json({ message: 'Email verificado com sucesso!' });
    } catch (err) {
        console.error('Erro ao verificar o email:', err);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

module.exports = { verifyEmail };
