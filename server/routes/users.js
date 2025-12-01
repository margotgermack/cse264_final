import { query } from '../db/postgres.js';
import bcrypt from "bcrypt";


const userRoutes = (app) => {

    // GET /users
    app.get('/users', async(req, res) => {
        try {
            const qs = `SELECT * FROM users`
            query(qs).then(data => res.json(data.rows))
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })


    //POST /users
    app.post('/users', async (req, res) => {
        try {
            const { username, password, type } = req.body

            if (!username || !password || !type) {
                return res.status(400).json({ 
                    error: "Username, password, and type are required." 
                })
            }

            //now we must hash the password using bcrypt import
            const saltRounds = 10
            const password_hash = await bcrypt.hash(password, saltRounds)

            const qs = `
                INSERT INTO users (username, password_hash, type)
                VALUES ($1, $2, $3)
                RETURNING *;
            `

            const params = [username, password_hash, type]
            const result = await query(qs, params)

            res.status(201).json({
                message: "User created successfully.",
                user: result.rows[0],
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    // DELETE /users
    app.delete('/users/:user_id', async(req, res) => {
        try {
            const { user_id } = req.body

            if (!user_id) {
                return res.status(400).json({ error: "user_id is required." })
            }

            const qs = `DELETE FROM users WHERE id = $1 RETURNING *;`
            const result = await query(qs, [user_id])

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "User not found." })
            }

            res.json({
                message: "User deleted successfully.",
                user: result.rows[0],
            });
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message });
        }
    })




}

export default userRoutes