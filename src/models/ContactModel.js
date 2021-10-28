const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  createdOn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.add = async function() {
  this.check();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.check();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
};

Contact.prototype.check = function() {
  this.cleanUp();
  console.log(this.body);
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email not valid.');
  if(!this.body.firstName) this.errors.push('First Name must be filled.');
  if(!this.body.phone && !this.body.email) this.errors.push('Contact must have phone OR email.');
};

Contact.prototype.cleanUp = function() {
  for(const key in this.body) {
    if (typeof this.body[key] !== 'string') this.body[key] = '';
  }

  this.body = {
    firstName: this.body.firstName,
    lastName: this.body.lastName,
    phone: this.body.phone,
    email: this.body.email
  }; 
};

// Static Models
Contact.searchById = async function(id) {
  if(typeof id !== 'string') return;  
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.searchContacts = async function() {
  const contacts = await ContactModel.find()
    .sort({ createdOn: -1 });
  return contacts;
}

Contact.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete({ _id: id });
  return contact;
}

module.exports = Contact;