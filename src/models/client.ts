/**
 * Client schema
 * 
 */

import mongoose from "mongoose";
import Joi from 'joi';

interface IClient {
    name: String;
    password: String;
}

const ClientSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
});


const Client = mongoose.model('client', ClientSchema);


export default Client;
export  { validateClient, IClient }


function validateClient(client: IClient) {

    const schema = Joi.object({
        name: Joi.string().required().min(3),
        password: Joi.string().required().min(4)
    });

    return schema.validate(client);

}