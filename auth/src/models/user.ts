import mongoose from 'mongoose';
import { Password } from '../services/password';
// an interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties that a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String.prototype,
    required: true,
  },
});

//using an arrow function here the value of this will be overridden
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

//use the statics property to build in a custom fucntion to our mongoose schema
//this was done and used with the inteface to ensure TS checks out types

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//<> --Generics type arguments, arguments to the function or model as types
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
