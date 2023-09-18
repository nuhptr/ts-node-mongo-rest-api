import express from 'express'
import { get, merge } from 'lodash'

import { getUserBySessionToken } from '../db/users'

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies['ADI-AUTH']

    if (!sessionToken) {
      return res.sendStatus(403).json({
        error: 'No session token',
      })
    }

    const existingUser = await getUserBySessionToken(sessionToken)

    if (!existingUser) {
      return res.sendStatus(403).json({
        error: 'Invalid session token',
      })
    }

    merge(req, { identity: existingUser })

    return next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400).json({ error: 'Invalid session token' })
  }
}

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id')
    const userId = `${currentUserId}` as string

    if (!userId) {
      return res.sendStatus(403).json({
        error: 'You are not authorized to access this resource',
      })
    }

    if (userId.toString() !== id) {
      return res.sendStatus(403).json({
        error: 'You are not authorized to access this resource',
      })
    }

    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400).json({
      error: 'Invalid session token',
    })
  }
}
