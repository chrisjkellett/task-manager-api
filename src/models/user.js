const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const schemaOptions = {
  timestamps: true
};

const schema = new mongoose.Schema({
  name: {
    type: String
  },
  age: {
    type: Number
  },
  email: {
    type: String,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('must provide a valid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value){
      if(/password/i.test(value)){
        throw new Error('must not contain the word password')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, schemaOptions);

schema.methods.toJSON = function(){
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
}

schema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'createdBy'
});

schema.methods.generateToken = async function() {
  const token = await jwt.sign({id: this._id.toString()}, process.env.AUTHORISATION_SIGNATURE);
  this.tokens = this.tokens.concat({token});
  await this.save();
  return token;
}

schema.statics.validateLogin = async (email, password) => {
  const user = await User.findOne({email});
  if(!user){
    throw new Error('login failed');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);

  if(!isValidPassword){
    throw new Error('login failed');
  }
  return user;
}

schema.pre('remove', async function (next){
  await Task.deleteMany({createdBy: this._id})
  next();
});

schema.pre('save', async function (next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', schema);
module.exports = User;