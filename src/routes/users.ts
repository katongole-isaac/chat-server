import { Router } from "express";
import helpers from "../helpers";


const router = Router();

//getting users
router.get('/', async(req, res)=> {

    const users = await helpers.getAllUsers();

    const me = "";
    
    // friends that u can send friend_request
    // filter yourself and members that are already your friends
    const remainingFriends = users?.filter( user => user)

});

// get all my friends
router.get('/friends', async(req, res) => {
    const me = "";

    // g

});


router.get("/friend-requests", async (req, res) => {
    // get friend request
    // i.e friend_request where u're the reciepent

});

export default router;