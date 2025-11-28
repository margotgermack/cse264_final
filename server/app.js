import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import courseRoutes  from './routes/courses.js'
import commentRoutes from './routes/comments.js'


import { query } from './db/postgres.js';

// create the app
const app = express()
// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json())
// set up some midlleware to handle cors
app.use(cors())

// base route
app.get('/', (req, res) => {
    res.send("Welcome to the Course Rating API!!!")
})


app.get('/up', (req, res) => {
  res.json({status: 'up'})
})

courseRoutes(app)
commentRoutes(app)


app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  