import express from 'express'

import { getUserByEmail, createUser } from '../db/users'
import { authentication, random } from '../helpers'

//? register endpoint
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.sendStatus(400).json({ message: 'Email/Password/Username Not Valid!' })
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.sendStatus(400).json({ message: 'Email Already Exists!' })
    }

    const salt = random()
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })

    // return json
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: 'Authentication Failed' })
  }
}

//? Login endpoint
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.sendStatus(400).json({
        message: 'Email/Password Not Valid!',
      })
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

    if (!user) {
      return res.sendStatus(400).json({
        message: 'User Not Found!',
      })
    }

    const expectedHash = authentication(user.authentication?.salt, password)

    if (user.authentication?.password !== expectedHash) {
      return res.sendStatus(400).json({
        message: 'Wrong Password!',
      })
    }

    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie('ADI-AUTH', user.authentication?.sessionToken, {
      domain: 'localhost',
      path: '/',
    })

    // return json
    return res.status(200).json(user).end()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400).json({ message: 'Authentication Failed' })
  }
}
