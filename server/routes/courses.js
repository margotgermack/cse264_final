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


}

export default courseRoutes