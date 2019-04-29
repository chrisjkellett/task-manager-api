const express = require('express');
const Task = require('../../models/task');
const router = new express.Router();
const middleware = require('../../middleware');
const {newTaskEmailConfirmation} = require('../../email/testing');

//CREATE TASK
router.post(
  '/tasks', 
  middleware.authorise, 
  async (req, res) => {
    try {
      const task = new Task({
        ...req.body,
        createdBy: req.user._id
      });
      const data = await task.save();
      newTaskEmailConfirmation(task, req.user);
      res.status(201).send(data);
    }
    catch (e) {
      res.status(500).send(e)
    }
  }
);

//READ TASK
router.get(
  '/tasks/:id', 
  middleware.authorise, 
  async (req, res) => {
    try {
      const task = await Task.findOne({_id: req.params.id, createdBy: req.user._id});
      if(!task){
        return res.status(404).send({error: 'could not fetch task'});
      }
      res.send(task);
    }
    catch (e) {
      res.status(500).send(e);
    }
  }
);

//READ ALL TASKS
router.get(
  '/tasks', 
  middleware.authorise, 
  middleware.filters, 
  middleware.options, 
  async (req, res) => {
    try {
      const tasks = await Task.find(req.filters, null, req.options);
      if(!tasks){
        return res.status(404).send({error: 'could not fetch tasks'});
      }
      res.send(tasks);
    }
    catch (e) {
      res.status(500).send(e);
    }
  }
);

//UPDATE TASK
router.patch(
  '/tasks/:id', 
  middleware.authorise, 
  async (req, res) => {
    const allowedFields = ['desc', 'done'];
    const fieldsToUpdate = Object.keys(req.body);
    const isValidUpdate = fieldsToUpdate.every(field => allowedFields.includes(field));
    
    if(!isValidUpdate){
      return res.status(400).send({error: `only ${allowedFields.join(" ")} can be patched`});
    }

    try {
      const task = await Task.findOne({_id: req.params.id, createdBy: req.user._id});
      if(!task){
        return res.status(404).send({error: 'could not patch task'});
      }
      fieldsToUpdate.forEach(field => task[field] = req.body[field]);
      await task.save();
      res.send(task);
    }
    catch (e) {
      res.status(500).send(e);
    }
});

//DELETE TASK
router.delete(
  '/tasks/:id',
  middleware.authorise, 
  async (req, res) => {
    try {
      const task = await Task.findOne({_id: req.params.id, createdBy: req.user._id});
      if(!task){
        return res.status(400).send();
      }
      task.remove();
      res.send({deleted: task});
    }
    catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;