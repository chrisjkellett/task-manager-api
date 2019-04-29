const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const authorise = require('../middleware/auth');

router.get('/users/me', authorise, async (req, res) => {
  try {
    if(!user){
      res.status(400).send({error: 'could not fetch user'});
    }
    res.send(req.user);
  }
  catch (e) {
    res.status(500).send()
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.validateLogin(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.send({user, token});
  }
  catch (e) {
    res.status(400).send({error: e.message});
  }
});

router.post('/users/logout', authorise, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((obj) => obj.token !== req.token);
    await req.user.save();
    res.send({success: 'logged out'});
  }

  catch (e) {
    res.status(400).send({error: 'unsuccessful'});
  }
});

router.post('/users/logout-all', authorise, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({success: 'all tokens deleted'});
  }

  catch (e) {
    res.status(400).send({error: 'unsuccessful'});
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const data = await user.save();
    const token = await user.generateToken();
    res.status(201).send({data, token});
  }
  catch (e) {
    res.status(400).send(e)
 }
});

router.patch('/users/me', authorise, async (req, res) => {
  const allowedUpdates = ['name', 'password', 'email'];
  const fieldsToUpdate = Object.keys(req.body);
  const isValidUpdate = fieldsToUpdate.every(field => allowedUpdates.includes(field));

  if(!isValidUpdate){
    res.status(400).send({error: 'cannot patch fields passed to db'});
  }

  try {
    const user = req.user;
    fieldsToUpdate.forEach(field => user[field] = req.body[field]);
    await user.save();
    res.send(user);
  }
  catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/users/me', authorise, async (req, res) => {
  try {
    const user = await req.user.remove();
    res.send({deleted: user});

  }
  catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;