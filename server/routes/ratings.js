import { query } from '../db/postgres.js';

const ratingRoutes = (app) => {

    // GET /courses/course_id/likes
    app.get('/courses/:course_id/ratings', async(req, res) => {
        const { course_id } = req.params
        try {
            const qs = `SELECT * FROM ratings WHERE course_id = ${course_id}`
            query(qs).then(data => res.json(data.rows))
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    //POST /ratings
    //only needed for first time rating a course
    app.post('/courses/:course_id/ratings', async(req, res) => {
        try {
            const { course_id } = req.params
            const { one_star, two_stars, three_stars, four_stars, five_stars } = req.body;

            if (!one_star || !two_stars || !three_stars || !four_stars || !five_stars) {
                return res.status(400).json({ 
                    error: "one_star, two_stars, three_stars, four_stars, and five_stars are required." 
                });
            }
            const qs = `INSERT INTO ratings 
            (course_id, one_star, two_stars, three_stars, four_stars, five_stars)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`

            const params = [course_id, one_star, two_stars, three_stars, four_stars, five_stars];
            const result = await query(qs, params);

            res.status(201).json({
                message: "rating created successfully.",
                comment: result.rows[0],
            });

        } catch (err) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    });

    // PUT /courses/:course_id/likes/:like_id
    //thought is the same as likes, check for existence of ratings if so, use get to get current amounts then
    //use put to update those current amounts with new change from user
    app.put('/courses/:course_id/ratings/:rating_id', async (req, res) => {
        try {
            const { course_id, rating_id } = req.params
            const { one_star, two_stars, three_stars, four_stars, five_stars } = req.body;

            if (!one_star || !two_stars || !three_stars || !four_stars || !five_stars) {
                return res.status(400).json({ 
                    error: "one_star, two_stars, three_stars, four_stars, and five_stars are required." 
                });
            }

            const qs = `
                UPDATE ratings
                SET one_star = $1,
                    two_stars = $2,
                    three_stars = $3,
                    four_stars = $4,
                    five_stars = $5
                WHERE id = $6 AND course_id = $7
                RETURNING *;
            `;

            const params = [one_star, two_stars, three_stars, four_stars, five_stars, rating_id, course_id];
            const result = await query(qs, params);


            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Course ratings not found." })
            }

            res.json({
                message: "Ratings updated successfully.",
                comment: result.rows[0]
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


}

export default ratingRoutes