
const bcrypt = require('bcrypt');
const User = require('../models/user');


exports.showLoginForm = (req, res) => {
  res.render('login');
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const user = await User.findOne({ username });

   
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);


    if (!passwordMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    
    req.session.user = {
      id: user._id,
      username: user.username,
    };

   
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.showRegisterForm = (req, res) => {
  res.render('register');
};


exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    await User.create({
      username,
      password: hashedPassword,
    });

   
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.logout = (req, res) => {
  
  req.session.destroy();
  res.redirect('/login');
};
