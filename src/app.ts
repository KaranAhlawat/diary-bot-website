// Package imports
require('dotenv').config();
import express = require('express');

// project and env variables imports.
const PORT = process.env.PORT;
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const errorRoute = require('./routes/error')

// creat an express app
const app: express.Application = express();

// setting various options and middleware routes for the app
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('src/public'))
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/error', errorRoute);

const currentDate = new Date();

// root get and post
app.get('/', (req: express.Request, res: express.Response) => {
	res.render('index', {year: currentDate.getFullYear()});
})

app.get('/contact', (req: express.Request, res: express.Response) => {
	res.render('contact');
})

app.get('/setup', (req: express.Request, res: express.Response) => {
	res.render('setup-instructions');
})


app.listen(PORT, () => {
	console.log(`Running on port :${PORT}`);
})