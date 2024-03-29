import { NextFunction, Response, Request } from "express";
import utils from "../utils";


export default async function (req:Request, res: Response, next: NextFunction) {

    const authToken = req.headers.authorization;
    if(!authToken) return res.status(400).send({error: "Please provide the authorization token"});

    const [_, token] = authToken.split(' ');

    const decoded = await utils.decodeToken(token);

    if(!decoded) return res.status(401).send({error: "Invalid token provided"});

    req.user = decoded.uid;
    next();

    return;

}