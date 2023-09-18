import mongoose from 'mongoose'

// create a schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
})

// create a model using the schema
export const UserModel = mongoose.model('User', UserSchema)

// get all users
export const getUsers = () => {
  return UserModel.find()
}

// get user by email
export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email })
}

// get user by session token
export const getUserBySessionToken = (sessionToken: string) => {
  return UserModel.findOne({
    'authentication.sessionToken': sessionToken,
  })
}

// get user by id
export const getUserById = (id: string) => {
  return UserModel.findById(id)
}

// create a new user
export const createUser = async (values: Record<string, any>) => {
  return new UserModel(values).save().then((user) => user.toObject())
}

// delete a user
export const deleteUserById = (id: string) => {
  return UserModel.findOneAndDelete({ _id: id })
}

// update a user
export const updateUserById = (id: string, values: Record<string, any>) => {
  return UserModel.findByIdAndUpdate(id, values)
}
