import { query } from '../db/postgres.js';

const commentRoutes = (app) => {

    // GET /courses/course_id/comments
    app.get('/courses/:course_id/comments', async(req, res) => {
        const { course_id } = req.params
        try {
            const qs = `SELECT * FROM comments WHERE course_id = ${course_id}`
            query(qs).then(data => res.json(data.rows))
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    //POST /comments
    app.post('/courses/:course_id/comments', async(req, res) => {
        try {
            const { course_id } = req.params
            const { created_by, body } = req.body;

            if (!created_by || !body) {
                return res.status(400).json({ 
                    error: "created_by, course_id, and body are required." 
                });
            }
            const qs = `INSERT INTO comments 
            (created_by, course_id, body)
            VALUES ($1, $2, $3)
            RETURNING *;`

            const params = [created_by, course_id, body];
            const result = await query(qs, params);

            res.status(201).json({
                message: "comment created successfully.",
                comment: result.rows[0],
            });

        } catch (err) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    });

    // PUT /courses/:course_id/comments/:comment_id
    app.put('/courses/:course_id/comments/:comment_id', async (req, res) => {
        try {
            const { course_id, comment_id } = req.params
            const { created_by, body } = req.body

            if (!created_by || !body) {
                return res.status(400).json({
                    error: "created_by and body are required."
                })
            }

            const qs = `
                UPDATE comments
                SET created_by = $1,
                    body = $2
                WHERE id = $3 AND course_id = $4
                RETURNING *;
            `;

            const params = [created_by, body, comment_id, course_id]
            const result = await query(qs, params)

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Comment not found." })
            }

            res.json({
                message: "comment updated successfully.",
                comment: result.rows[0]
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });

    // DELETE /courses/:course_id/comments/:comment_id
    app.delete('/courses/:course_id/comments/:comment_id', async (req, res) => {
        try {
            const { course_id, comment_id } = req.params

            const qs = `
                DELETE FROM comments
                WHERE id = $1 AND course_id = $2
                RETURNING *;
            `;

            const params = [comment_id, course_id]
            const result = await query(qs, params)

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Comment not found." })
            }

            res.json({
                message: "comment deleted successfully.",
                comment: result.rows[0]
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


}

export default commentRoutes