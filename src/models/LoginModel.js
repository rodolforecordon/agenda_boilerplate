const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.check(); 
    if (this.errors.length > 0) return;

    await this.userExists();

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);    

    try {
      this.user = await LoginModel.create(this.body);
    } catch(e) {
      console.log(e);
    }
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email});

    if (user) this.errors.push('User already registered.')
  }

  check() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) this.errors.push('Email not valid.');
    if (this.body.password.length < 8 || this.body.password.length > 50) this.errors.push('Password must be 8-50 characters long.');
  }

  cleanUp() {
    for(const key in this.body) {
      if (typeof this.body[key] !== 'string') this.body[key] = '';
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;