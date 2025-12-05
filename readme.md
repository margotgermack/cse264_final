# CSE264 Final Project: Full Stack
## Due: Friday, May 2, 2025 at 11:59 PM
## Add your full name and Lehigh email address to this README!

**Project Overview (Name, description, purpose):**

MountainCourse is a web platform for Lehigh students to discover, rate, and review courses. This web app will help students make informed academic decisions based on real student feedback. The platform allows users to register, browse courses, submit reviews, rate difficulty, and like or dislike course pages and comments. Admins will have the ability to moderate and manipulate content as necessary.

**Team Members & Roles**

Audrey: Frontend Lead  
* Build UI, create page layouts, routing, interactive components
* Handle client-side logic and API calls

Sierra: Backend Lead
* Build internal REST API, secure endpoints
* Implement database models and queries

Margot: Full-Stack
* Database design, deployment setup, testing
* Assist with both frontend and backend tasks


**Application Features (How it meets each requirement)**

User Accounts & Roles
* Students create accounts to post and interact
* Admin users can remove users or courses

Database
* Stores users, courses, likes, ratings, and votes,
* Uses PostgreSQL with Supabase

Interactive UI
* Search bar, department filter
* Like/dislike updates on webpage
* Review submission form

New Library / Framework
* Material UI

Internal REST API
* Custom Express API for course data, reviews, votes


**Installation & Setup Instructions (How to install, run, and configure the application)**

1. Clone repository
2. Create .env file with proper credentials
3. Change directory to server and run `npm install`
4. Run `npm run dev`
5. Change directory to client and run `npm install`
6. Run `npm run dev`
7. Click link for client web app printed in console

**API Keys & Database Setup (What environment variables or external configurations are needed)**

The only configurations needed are credentials to put into the .env file, including:  
OSTGRES_HOST=aws-1-ca-central-1.pooler.supabase.com  
POSTGRES_PORT=5432  
POSTGRES_DBNAME=postgres  
POSTGRES_USERNAME=postgres.ppyziifoxqltzbylpwxn  
POSTGRES_PASSWORD=(password)


### Project Requirements
Your web application should have/do the following:

Your web application must include the following:
* User Accounts & Roles: Implement different user roles such as user/admin, free/paid, etc.
* Database: Your application must store and retrieve data from a database of your choice.
* Interactive UI: Your web app must have an interactive user interface, which can include forms, real-time updates, animations, or other dynamic elements.
* New Library or Framework: You must use at least one library or framework that was not covered in class.
* Internal REST API: Your project must have an API layer used to store and retrieve data
* External REST API: You may include an external REST API (e.g., Reddit API, Spotify API, OpenWeather API, etc.).


### Installation and Running the Project

#### Client
The client for this project uses React + Vite template which provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project on localhost:5173 (or at the location specified in the console).

#### Server
You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project with nodemon. Nodemon auto-restarts the node server every time you make a change to a file. This is very helpful when you are writing and testing code.

##### .env and Postgres Installation

A Postgres instance may have been provided to you. Your username for the database is your 6 character alphanumeric lehigh id. Your password for the database is your 6 character alphanumeric lehigh id followed by '_lehigh'.

You will need to create a .env from the .env.example You can do this by running this line of code in your terminal 

`cp .env.example .env`

Then store your Database credentials in your .env file.

**Note: Never EVER push private information (like credentials) to a Git Repo. We use .env to store this connection information and ensure that git (using .gitignore) never pushes this private information in the repo. Never ever store real credentials in .env.example or anywhere that is not .env as you may push these changes to your git repo.**

### Grading
* **Project Functionality** -- **30 points** -- Meets all outlined requirements
* **Technical Implementation** -- **25 points** -- Clean code, database integration, API Usage
* **UI/UX & Interactivity** -- **15 points** -- Well-designed, intuitive, and responsive UI
* **Use of New Tech** -- **10 points** -- Implements a library/framework not covered in class
* **Project Documentation** -- **10 points** -- Clear README, installation guide, and API setup
* **Presentation & Demo** -- **10 points** -- Engaging, clear explanation, and live demo

**If code doesn't run/compile you can get no more than a 60. But please write comments and a README to explain what you were trying to do.**


## Routes: *=admin only
POST /users  
GET /users  
DELETE /users  *

POST /courses  
GET /courses  
GET /courses/:id  
PUT /courses/:id  *
DELETE /courses/:id  *

POST /courses/:id/comments  
GET /courses/:id/comments  
PUT /courses/:id/comments/:comment_id  
DELETE /courses/:id/comments/:comment_id  

POST /courses/:id/likes  
PUT /courses/:id/likes  
> thought is to check for existance of course in database, if not present, use post to create new entry to track likes. If present, use put to alter entry for corresponding course's likes
GET /courses/:id/likes  
DELETE /courses/:id/likes  *

POST /courses/:id/ratings
PUT /courses/:id/ratings
> Same thought for ratings as likes
GET /courses/:id/ratings
> We can show what percentage of users rated each course at each star amount, and then calculate average rating