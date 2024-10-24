import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const secret = "backend-Login-2024";

interface RequestWithToken extends Request {
  token?: {
    username: string;
    firstname: string;
    lastname: string;
    id: string;
    phone: string;
    rolename: string;
    role: string;
    statusmaster: string;
  };
}

const ifnotLogin = (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) => {
  const tokenHeaders = req.headers.authorization?.split(" ")[1];
  if (!tokenHeaders) {
    res.status(401).send(`Unauthorized: You are not logged in.`);
  } else {
    try {
      const verify = jwt.verify(tokenHeaders, secret) as {
        username: string;
        firstname: string;
        lastname: string;
        id: string;
        phone: string;
        rolename: string;
        role: string;
        statusmaster: string;
      };
      req.token = {
        username: verify.username,
        firstname: verify.firstname,
        lastname: verify.lastname,
        id: verify.id,
        phone: verify.phone,
        rolename: verify.rolename,
        role: verify.role,
        statusmaster: verify.statusmaster,
      };
      next();
    } catch (err) {
      res.status(401).send(`Unauthorized: Invalid token.`);
    }
  }
};

const ifnotRoleADMIN = (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) => {
  const tokenHeaders = req.headers.authorization?.split(" ")[1];
  if (!tokenHeaders) {
    res.status(401).send("Unauthorized: You are not logged in.");
    return;
  }

  try {
    const verify = jwt.verify(tokenHeaders, secret) as {
      username: string;
      firstname: string;
      lastname: string;
      id: string;
      phone: string;
      rolename: string;
      role: string;
      statusmaster: string;
    };

    if (verify.role !== "ADMIN") {
      res
        .status(401)
        .send("Unauthorized: You do not have the right permissions.");
      return;
    }

    req.token = {
      username: verify.username,
      firstname: verify.firstname,
      lastname: verify.lastname,
      id: verify.id,
      phone: verify.phone,
      rolename: verify.rolename,
      role: verify.role,
      statusmaster: verify.statusmaster,
    };
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: Invalid token.");
  }
};

export { RequestWithToken, secret, ifnotLogin, ifnotRoleADMIN };
