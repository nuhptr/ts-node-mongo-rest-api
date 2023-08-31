import express from 'express';

import { deleteUserById, getUsers } from '../db/users';

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = await getUsers();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({
      error: "Can't get all users",
    });
  }
};

export const deleteUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUsers = await deleteUserById(id);

    return res
      .status(200)
      .json({ message: 'success delete users', deletedUsers });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({
      error: 'failed delete users',
    });
  }
};
