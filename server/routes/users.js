import { query } from '../db/postgres.js';
import bcrypt from "bcrypt";


const userRoutes = (app) => {

    // GET /users
    app.get("/users", async (req, res) => {
    try {
        const qs = `SELECT * FROM users`;
        const data = await query(qs);

        // remove password_hash before sending to client
        const safeUsers = data.rows.map(({ password_hash, ...rest }) => rest);

        res.json(safeUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
    });



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


    app.get('/users/:user_id', async(req, res) => {
        try {
            const { user_id } = req.params

            if (!user_id) {
                return res.status(400).json({ 
                    error: "user_id is required." 
                })
            }
            
            const qs = `SELECT * FROM users WHERE id = $1;`
            const userData = await query(qs, [user_id])

            if (userData.rowCount === 0) { //validation for resource not found
                return res.status(404).json({ error: `User ID ${user_id} not found` })
            }

            const user = userData.rows[0]
            res.json(user)

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })


    // DELETE /users
    app.delete('/users/:user_id', async(req, res) => {
        try {
            const { user_id } = req.params

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

    // PUT /users/:user_id  -> update user type (student/admin)
    app.put("/users/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const { type } = req.body;

        if (!type || !["student", "admin"].includes(type)) {
        return res
            .status(400)
            .json({ error: "Valid type is required: 'student' or 'admin'." });
        }

        const qs = `
        UPDATE users
        SET type = $2
        WHERE id = $1
        RETURNING *;
        `;

        const result = await query(qs, [user_id, type]);

        if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found." });
        }

        const { password_hash, ...safeUser } = result.rows[0];

        res.json({
        message: "User type updated successfully.",
        user: safeUser,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
    });


    // login route
    app.post('/auth/login', async (req, res) => {
        try{
            const {email, password} = req.body
            if(!email || !password){
                return res.status(400).json({ error: "Please enter an email and password"})
            }
            const qs = `SELECT * FROM users WHERE username = $1`
            const result = await query(qs, [email])

            if (result.rowCount === 0) {
                return res.status(401).json({ error: "Invalid email or password." })
              }
          
              const user = result.rows[0]
              delete user.password // remove password from response
          
              res.json({ user })
          
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })




}

export default userRoutes