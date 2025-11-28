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

            if (!created_by || !body || !course_id) {
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
    })

/*
    // GET /comments/comment_id
    app.get('/comments/:comment_id', async(req, res) => {
        try {
            const { comment_id } = req.params

            const commentQs = `SELECT * FROM comments WHERE id = ${comment_id}`
            const commentData = await query(commentQs)

            if (commentData.rowCount === 0) { //validation for resource not found
            return res.status(404).json({ error: `comment ID ${comment_id} not found` })
            }

            const comment = commentData.rows[0]
            res.json(comment)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    // DELETE /comments/comment_id
    app.delete('/comments/:comment_id', async (req, res) => {
        try {
            const { comment_id } = req.params;

            const qs = `DELETE FROM comments WHERE id = $1 RETURNING *`;
            const result = await query(qs, [comment_id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: `comment ID ${comment_id} not found` })
            }

            res.json({
                message: "comment deleted successfully.",
                deleted: result.rows[0]
            });

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    // PUT /comments/comment_id
    app.put('/comments/:comment_id', async (req, res) => {
        try {
            const { comment_id } = req.params;
            const { code, name, description } = req.body;

            if (!code || !name || !description) {
                return res.status(400).json({
                    error: "code, name, and description are required."
                })
            }

            const qs = `
                UPDATE comments
                SET code = $2,
                name = $3,
                description = $4
                WHERE id = $1
                RETURNING *;
            `;

            const params = [comment_id, code, name, description]
            const result = await query(qs, params)

            if (result.rowCount === 0) {
                return res.status(404).json({ error: `comment ID ${comment_id} not found` })
            }

            res.json({
                message: "comment updated successfully.",
                updated: result.rows[0]
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message })
        }
    });
*/


}

export default commentRoutes