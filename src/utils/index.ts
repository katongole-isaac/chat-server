/**
 * miscellaneous utilities function
 * 
 */

import { firebaseAuth as auth } from "../lib/firebase";

class Utils {

   async decodeToken(token:string){
         return await auth.verifyIdToken(token);
    }

}

export default new Utils();