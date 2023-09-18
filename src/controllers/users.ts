import express from 'express'

import { deleteUserById, getUserById, getUsers } from '../db/users'

//? Get All Users
export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const user = await getUsers()

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400).json({
      error: "Can't get all users",
    })
  }
}

//? Delete User
export const deleteUsers = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const deletedUsers = await deleteUserById(id)

    return res.status(200).json({ message: 'success delete users', deletedUsers })
  } catch (error) {
    console.log(error)
    return res.sendStatus(400).json({
      error: 'failed delete users',
    })
  }
}

//? Update User
export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) return res.status(400)

    const user = await getUserById(id)

    if (user) user.username = username
    await user?.save()

    return res.status(200).json({ message: 'success update users', user })
  } catch (error) {
    console.log(error)
    return res.sendStatus(400).json({
      error: 'failed update users',
    })
  }
}
