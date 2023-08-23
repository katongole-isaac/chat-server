/**
 * Client signup
 *
 */

import express, { Router, Request, Response } from "express";
import { IClient, validateClient } from "../models/client";

const router: Router = express.Router();

router.post("/signup", async (req: Request, res: Response)  => {

  const { error, } = validateClient(req.body as IClient);
  if(error) return res.status(400).send({error: error.details[0].message });

  const { password, name } = req.body as IClient;
  


});

export default router;
