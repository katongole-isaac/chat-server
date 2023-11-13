import { Router } from "express";
import helpers from "../helpers";
import auth from "../middleware/auth";

const router = Router();

//getting users
router.get("/", auth, async (req, res) => {
  const me = await helpers.getUser(req.user);
  if (!me) return res.status(400).send({ error: "No user found " });

  const users = await helpers.getAllUsers();
  if (!users || users.length === 0) return res.send({ users: [] });

  // friends that u can send friend_request
  // filter yourself and members that are already your friends
  const remainingFriends = users.filter(
    (user) => user.userId !== me.userId && !user.friends.includes(user.userId)
  );
  return res.send({ users: remainingFriends });
});    

// get all my friends
router.get("/friends", auth, async (req, res) => {
  const me = await helpers.getUser(req.user);
  if (!me) return res.status(400).send({ error: "No user found " });

  return res.send({ friends: me.friends });
});

router.get("/friend-requests", auth, async (req, res) => {
    
  const me = await helpers.getUser(req.user);
  if (!me) return res.status(400).send({ error: "No user found " });

  const friendRequests = await helpers.getMyFriendRequests(me.userId);
  return res.send({ friendRequests });
  
});

export default router;