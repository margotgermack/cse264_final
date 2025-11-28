import { query } from '../db/postgres.js';

const courseRoutes = (app) => {

    // GET /courses
    app.get('/courses', async(req, res) => {
        try {
            const qs = `SELECT * FROM courses`
            query(qs).then(data => res.json(data.rows))
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    //POST /courses
    app.post('/courses', async(req, res) => {
        try {
            const { code, name, description } = req.body;

            if (!code || !name || !description) {
                return res.status(400).json({ 
                    error: "code, name, and description are required." 
                });
            }
            const qs = ` INSERT INTO courses 
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING *;`;

            const params = [code, name, description || null];
            const result = await query(qs, params);

            res.status(201).json({
                message: "Course created successfully.",
                application: result.rows[0],
            });

        } catch (err) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    })


    // GET /courses/course_id
    app.get('/courses/:course_id', async(req, res) => {
        try {
            const { course_id } = req.params

            const courseQs = `SELECT * FROM courses WHERE id = ${course_id}`
            const courseData = await query(courseQs)

            if (courseData.rowCount === 0) { //validation for resource not found
            return res.status(404).json({ error: `Course ID ${course_id} not found` })
            }

            const course = courseData.rows[0]
            res.json(course)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    // DELETE /courses/course_id
    app.delete('/courses/:course_id', async (req, res) => {
        try {
            const { course_id } = req.params;

            const qs = `DELETE FROM courses WHERE id = $1 RETURNING *`;
            const result = await query(qs, [course_id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: `Course ID ${course_id} not found` })
            }

            res.json({
                message: "Course deleted successfully.",
                deleted: result.rows[0]
            });

        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    });


    // PUT /courses/course_id
    app.put('/courses/:course_id', async (req, res) => {
        try {
            const { course_id } = req.params;
            const { code, name, description } = req.body;

            if (!code || !name || !description) {
                return res.status(400).json({
                    error: "code, name, and description are required."
                })
            }

            const qs = `
                UPDATE courses
                SET code = $2,
                name = $3,
                description = $4
                WHERE id = $1
                RETURNING *;
            `;

            const params = [course_id, code, name, description]
            const result = await query(qs, params)

            if (result.rowCount === 0) {
                return res.status(404).json({ error: `Course ID ${course_id} not found` })
            }

            res.json({
                message: "Course updated successfully.",
                updated: result.rows[0]
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message })
        }
    });



}

export default courseRoutes