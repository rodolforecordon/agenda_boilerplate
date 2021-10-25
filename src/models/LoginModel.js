const mongoose = require('mongoose');
const validator = require('validator');

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

  async signup() {
    this.check();
    if (this.errors.length > 0) return;
    
    try {
      this.user = await LoginModel.create(this.body);
    } catch(e) {
      console.log(e);
    }
  }

  check() {
    this.cleanUp();
    // check if email is valid
    if (!validator.isEmail(this.body.email)) this.errors.push('Email not valid.');
    // check if password is valid
    if (this.body.password < 8 || this.body.password > 50) this.errors.push('Password must be 8-30 characters long.');
  }

  cleanUp() {
    for(const key in this.body) {
      if (typeof this.body[key] !== 'string') this.body[key] = '';
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login;