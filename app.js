const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser')


const app = express();
const port = 4000;


mongoose.connect('mongodb+srv://avaamo:hAThOeBHoeagxQrl@cluster0.bfybzn7.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log('connected to database')).then(()=>app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  }));

app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.json());

app.use(express.static('views'));

const userController = require('./controllers/userController');
const infoController = require('./controllers/infoController');


app.get('/', (req, res) => {
  res.redirect('/login');
});


app.get('/login', userController.showLoginForm);
app.post('/login', userController.login);
app.get('/register', userController.showRegisterForm);
app.post('/register', userController.register);
app.get('/logout', userController.logout);


app.get('/dashboard', infoController.getDashboard);
app.get('/add-user', infoController.showAddUserForm);
app.post('/save-info', infoController.saveUserInfo);
app.get('/update-info/:infoId', infoController.showUpdateForm);
app.post('/update-info/:infoId', infoController.updateUserInfo);
app.post('/delete-info/:infoId', infoController.deleteUserInfo);



