const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const OwnProjectSchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true },
}, {
  _id: false,
});

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ownTenant: { type: Schema.Types.ObjectId, required: true },
  ownProjects: [OwnProjectSchema],
}, {
  timestamps: true,
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified('password')) next();

  bcrypt.genSalt(SALT_FACTOR, (saltErr, salt) => {
    if (saltErr) next(saltErr);

    const hash = bcrypt.hashSync(user.password, salt, null);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model('user', UserSchema);
