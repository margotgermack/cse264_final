import { query } from '../db/postgres.js';

const courseRoutes = (app) => {

  // GET URL Path /courses
  app.get('/courses', async(req, res) => {
    try {
        const { search } = req.query
        const qs = `SELECT * FROM courses`

        query(qs).then(data => res.json(data.rows))
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  });


}

export default courseRoutes