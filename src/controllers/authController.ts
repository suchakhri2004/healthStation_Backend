import { Request, Response } from "express";
import { pool } from "../db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RequestWithToken,
  ifnotLogin,
  ifnotRoleADMIN,
} from "../authen/authMiddleware";
import dotenv from "dotenv";

export const login = async (req: Request, res: Response) => {
  try {
    const checkUsername = await pool.query(
      "SELECT * FROM master WHERE username = $1",
      [req.body.username]
    );
    const checkStatus = await pool.query(
      `SELECT statusmaster FROM master WHERE username = $1`,
      [req.body.username]
    );

    if (checkUsername.rows.length === 0) {
      return res.status(400).send(`username or password is incorrect`);
    }

    if (checkStatus.rows[0].statusmaster !== "READY") {
      return res.status(400).send(`status is not ready`);
    }

    const user = checkUsername.rows[0];

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (passwordMatch) {
      if (process.env.SECRET) {
        const token = jwt.sign(
          {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            id: user.id,
            rolename: user.rolename,
            role: user.role,
            phone: user.phone,
            statusmaster: user.statusmaster,
          },
          process.env.SECRET,
          { expiresIn: "3h" }
        );
        return res
          .status(200)
          .json({
            token,
            rolename: user.rolename,
            role: user.role,
            status: user.statusmaster,
            id: user.id,
            message: `Login Success`,
          });
      } else {
        return res
          .status(500)
          .send("Internal Server Error: Secret is undefined");
      }
    } else {
      return res.status(400).send(`username or password is incorrect`);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};
