const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
  res.render('contact', {
    contact: {}
  });
};

exports.add = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.add();
    
    if(contact.errors.length > 0) {
      req.flash('errors', contact.errors);
      req.session.save(() => res.redirect('/contact'));
      return;
    }
  
    req.flash('success', 'Contact successfully added.');
    req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
    return;
  }
};

exports.editIndex = async (req, res) => {
  try {
    if(!req.params.id) return res.render('404');

    const contact = await Contact.searchById(req.params.id);
    if(!contact) return res.render('404');

    res.render('contact', { contact });
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.edit = async (req, res) => {
  try {
    if(!req.params.id) return res.render('404');
    const contact = new Contact(req.body);
    await contact.edit(req.params.id);

    if(contact.errors.length > 0) {
      req.flash('errors', contact.errors);
      req.session.save(() => res.redirect('/contact/:id'));
      return;
    }
  
    req.flash('success', 'Contact edited.');
    req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async (req, res) => {
  try {
    if(!req.params.id) return res.render('404');

    const contact = await Contact.delete(req.params.id);
    if(!contact) return res.render('404');

    req.flash('success', 'Contact deleted.');
    req.session.save(() => res.redirect('/'));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};