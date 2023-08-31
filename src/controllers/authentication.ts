import express from 'express';

import { getUserByEmail, createUser } from 'db/users';
import { authentication, random } from 'helpers';

export const register = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .sendStatus(400)
        .json({ message: 'Email/Password/Username Not Valid!' });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .sendStatus(400)
        .json({ message: 'Email Already Exists!' });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    // return json
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: 'Authentication Failed' });
  }
};
