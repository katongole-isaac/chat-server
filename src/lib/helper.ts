/**
 * Contains some of the utilities
 *
 */

import crypto from "node:crypto";
import { promisify } from "node:util";

type Helper = {
  [property: string]: any;
};

type HashResult = {
  error: string | null | unknown;
  hash: string | null;
};

const digest: string = "sha256";

// containers
const helpers: Helper = {};

helpers.hashPassword = async function (password: string): Promise<HashResult> {
  if (!(password.length > 0)) return { error: null, hash: null };

  const salt = crypto.randomBytes(128).toString("hex");
  const iterations = 1000;
  const keyLength = 256;

  const result: HashResult = {
    error: null,
    hash: null,
  };

  try {
    const derivedKey = await promisify(crypto.pbkdf2)(
      password,
      salt,
      iterations,
      keyLength,
      digest
    );

    result.hash = `${derivedKey.toString("hex")}${salt}`;
  } catch (error) {
    result.error = error;
  }

  return result;
};

helpers.verifyPassword = async function (
  password: string,
  hashedPassword: string
) {
  const [hash, salt] = hashedPassword.split("$");

  const { result, error } = await helpers.hashPassword(password);

  return result.hash === hashedPassword ? true : false;
};

export default helpers;

//@todo test the above functions.

async function test() {

    // helpers.
} 