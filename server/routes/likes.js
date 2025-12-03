import { query } from '../db/postgres.js';

const likeRoutes = (app) => {

    // GET /courses/course_id/likes
    app.get('/courses/:course_id/likes', async(req, res) => {
        const { course_id } = req.params
        try {
            const qs = `SELECT * FROM likes WHERE course_id = ${course_id}`
            query(qs).then(data => res.json(data.rows))
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    //POST /likes --> this is only used when liking a course for the first time
    app.post('/courses/:course_id/likes', async(req, res) => {
        try {
            const { course_id } = req.params
            const { likes, dislikes } = req.body;

            if (!likes || !dislikes) {
                return res.status(400).json({ 
                    error: "likes and dislikes are required." 
                });
            }
            const qs = `INSERT INTO likes 
            (course_id, likes, dislikes)
            VALUES ($1, $2, $3)
            RETURNING *;`

            const params = [course_id, likes, dislikes];
            const result = await query(qs, params);

            res.status(201).json({
                message: "like/dislike created successfully.",
                comment: result.rows[0],
            });

        } catch (err) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    });

    // PUT /courses/:course_id/likes/:like_id --> this is used on existing like/dislike counts
    //thought is to get /courses/:course_id/likes to get like and dislike count, then call put route with
    //incremented like or dislike count to update total count
    app.put('/courses/:course_id/likes/:like_id', async (req, res) => {
        try {
            const { course_id, like_id } = req.params;
            const { likes, dislikes } = req.body;

            if (
                likes === undefined || likes === null ||
                dislikes === undefined || dislikes === null
            ) {
                return res.status(400).json({ error: "likes and dislikes are required." });
            }

            const qs = `
                UPDATE likes
                SET likes = $1,
                    dislikes = $2
                WHERE id = $3 AND course_id = $4
                RETURNING *;
            `;

            const params = [likes, dislikes, like_id, course_id];
            const result = await query(qs, params);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Course likes/dislikes not found." });
            }

            res.json({
                message: "Like/dislike count updated successfully.",
                comment: result.rows[0]
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });


    // DELETE /courses/:course_id/comments/:comment_id
    app.delete('/courses/:course_id/likes/:like_id', async (req, res) => {
        try {
            const { course_id, like_id } = req.params

            const qs = `
                DELETE FROM likes
                WHERE id = $1 AND course_id = $2
                RETURNING *;
            `;

            const params = [like_id, course_id]
            const result = await query(qs, params)

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Course likes/dislikes not found." })
            }

            res.json({
                message: "Like/dislike count deleted successfully.",
                comment: result.rows[0]
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


}

export default likeRoutes