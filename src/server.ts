/**
 * Http server
 *
 */

import http from "node:http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase-admin/firestore";
import { DecodedIdToken } from "firebase-admin/auth";

import app from "./app";
import utils from "./utils";
import user from "./utils/user";
import { SocketEvents } from "./types";
import socketUtils from "./utils/socket";
import { WebSocketExt } from "../websocket";
import friendRequest, {FriendRequest, NewFriendRequest} from "./utils/friendRequest";



const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });  

const onSocketError = (err:Error) => {
  console.log(`[SOCKET_UPGRADE]: ${err}`);
  process.exit(1);
}

server.on("upgrade", (req, socket, head) => {

  if (!req.url?.includes("/chat")) return;

  // listen for socket errors
  socket.on('error', onSocketError);

    wss.handleUpgrade(req, socket, head, async function (ws) {
      // authentication
     if(!(await socketUtils.authenticate(req, socket))) return;

      socket.removeListener("error", onSocketError);

      wss.emit("connection", ws, req);

    });
});

wss.on("connection", async (ws: WebSocketExt, req) => {

  const parsedURL = new URL(req.url!, `http://${req.headers.host}`);

  const token = parsedURL.searchParams.get("token")!;

  // decode token to get user info
  const decoded = (await utils.decodeToken(token)) as DecodedIdToken;

  const { uid, email } = decoded; // get user props

  // assigning connection id to ws
  const socket_id = uuidv4();

  console.log('socket_id: ', socket_id);

  // search for user
  let _user = await user.get(uid);

  // create the user if doesn't exist in DB
  if (!_user)
    await user.create(uid, {
      socket_id,
      email: email as string,
      userId: uid,
      friends: []
    });
  // update socket_id of the user if he exists
  else await user.update(uid, { socket_id });

  // set socket_id to ws
  ws.id = socket_id;
  

  // register event handler or listeners
  ws.on(SocketEvents.FRIEND_REQUEST, async (data: FriendRequest) => {
    // look up the recipient id
    const recipient = await user.get(data.to);

    if (!recipient) return;

    // check if the recipient is among the user who are online.
    wss.clients.forEach(async (_client) => {
      const client = _client as WebSocketExt;

      if (client.id === data.to) {
        // here you've got the recipient

        const sender = await user.get(data.from);

        // create a new friend request
        const new_friend_request: NewFriendRequest = {
          recipient: recipient.userId,
          sender: sender!.userId,
          createdAt: Timestamp.now(),
        };

        // save the request to friend_request collection
        friendRequest.create(new_friend_request);

        // notify the recipient
        client.send(JSON.stringify({ message: "New Friend Request" }));

        // emit new_friend_request so that we can log/save its details
        // client.emit("new_friend_request", new_friend_request);
      }

      // notify the sender
      if (client.id === data.from)
        client.send(JSON.stringify({ message: "Friend Request sent" }));
    });
  });

  ws.on(SocketEvents.ACCEPT_FRIEND_REQUEST, async (id: string) => {
    // search for friend request with that id
    const _friendRequest = (await friendRequest.get(
      id
    )) as FirebaseFirestore.DocumentData;

    const { sender, recipient } = _friendRequest;

    // update the sender & recipient friends array;

    await user.update(sender, {
      friends: [recipient],
    });

    // add sender as a friend of the recipient
    await user.update(recipient, {
      friends: [sender],
    });

    // here u can remove the friend request from the DB
    await friendRequest.delete(id);

    // notify the sender that the request is accepted
    wss.clients.forEach(async (_client) => {
      const client = _client as WebSocketExt;

      // look up the sender
      const _sender = await user.get(sender)!;

      // send a notification
      if (client.id === _sender!.socket_id)
        return client.send(JSON.stringify({ message: "Request accepted" }));
    });
  });
});

// listening
server.listen(PORT, () => {
  console.log(`\x1b[1;32m [SERVER] Running on PORT %d ... \x1b[0m`, PORT);
});
