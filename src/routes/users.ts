import { Router } from "express";

import user from "../utils/user";
import auth from "../middleware/auth";
import friendRequest from "../utils/friendRequest";

const router = Router();

//getting users
router.get("/", auth, async (req, res) => {
  const me = await user.get(req.user);
  if (!me) return res.status(400).send({ error: "No user found " });

  const users = await user.getAll();
  if (!users || users.length === 0) return res.send({ users: [] });

  // friends that u can send friend_request
  // filter yourself and members that are already your friends
  const remainingFriends = users.filter((user) => user.userId !== me.userId && !user.friends.includes(user.userId));
  return res.send({ users: remainingFriends });

});    

// get all my friends
router.get("/friends", auth, async (req, res) => {

  const me = await user.get(req.user);
  if (!me) return res.status(400).send({ error: "No user found " });

  if(me.friends.length <= 0 ) return res.send({friends: [ ]});

  const friends = me.friends.map( async(friend) => await user.get(friend));

  return res.send({ friends });
});

router.get("/friend-requests", auth, async (req, res) => {

  const me = await user.get(req.user);
  if (!me) return res.status(400).send({ error: "No user found " });

  const friendRequests = await friendRequest.getAll(me.userId);
  return res.send({ friendRequests });
  
});

export default router;