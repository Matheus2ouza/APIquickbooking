const { pool } = require('../db/dbP');
const { body, validationResult, Result } = require('express-validator');

const requiredField = (fieldName) =>{
    return body(fieldName)
    .isString()
    .trim()
    .escape()
    .notEmpty()
    .withMessage(`O campo ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} não pode estar vazio`)
}

const validId = (id) =>{
    return body(id)
    .isInt({gt: 0})
    .withMessage(`O Id não é um valor valido`)
    
}

const company = [
    requiredField('ownerName'),
    requiredField('document'),
    requiredField('companyName'),
    validId('userId'),

    async(req, res) =>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            console.error(`Validation error: ${errors.array()}`);
            return res.status(400).json({errors: errors.array() });
        }

        const { ownerName, document, companyName, userId} = req.body;

        try{
            const idVerification = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
            const id = idVerification.rows[0];

            if(!id) {
                console.warn(`id not found`)
                return res.status(401).json({ message: `id not found` })
            }

            const registerCompany = await pool.query(
                'INSERT INTO companies(name, document, owner, user_id) VALUES ($1, $2, $3, $4) RETURNING id',
                [companyName, document, ownerName, userId]
            );
            
            const companyId = registerCompany.rows[0].id;
            console.log(`Registered company ${companyName}`)
            console.log(`Id from ${companyName} is ${companyId}`)
            return res.status(201).json({ message: `Registered company -> ${companyName}`, companyId})
        }
        catch (err) {
            console.log(`Server error: ${err}`)
            return res.status(500).json({message: 'Server error'})
        }
        
    }
];

module.exports = { company }
