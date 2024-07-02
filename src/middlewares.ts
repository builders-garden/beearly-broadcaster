import { NextFunction, Request, Response } from "express";
import { env } from "./env.js";

/**
 * @dev simple middleware that checks for the presence of the x-beearly-api-key header
 * @param {Request} req input express request
 * @param {Response} res output express response
 * @param {NextFunction} next express next function
 */
export const beearlyKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beearlyApiKey = req.header("x-beearly-api-key");
  if (!beearlyApiKey || beearlyApiKey !== env.BEEARLY_API_KEY) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
};