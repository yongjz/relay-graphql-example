import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  password: String,
  mail: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// var User = mongoose.model('User', UserSchema)
//
// module.exports = User

mongoose.model('User', UserSchema);
// exports.User = mongoose.model('User');
