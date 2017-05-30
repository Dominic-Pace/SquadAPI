import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

import { getRandomRefCode } from '../../utils/string-utils';

const REF_CODE_LENGTH = 6;

let Schema = mongoose.Schema;

const emailRegEx = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

let UserSchema = new Schema({

  email: {
    type: String,
    unique: true,
    lowercase: true,
    regex: emailRegEx
  },
  password: String,
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user']
  },
  homeTown: {
    location: { type: String, required: true },
    coordinates: [Number]
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  squads: [{
    type: Schema.Types.ObjectId,
    ref: 'Squads'
  }],
  refCode: {
    type: String,
    default: getRandomRefCode(REF_CODE_LENGTH),
    unique: true
  },
  squadTokens : {
    type: Number,
    default: 0
  },
  badges: [{
    type: Schema.Types.ObjectId,
    ref: 'Badges'
  }],
  createdDate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
