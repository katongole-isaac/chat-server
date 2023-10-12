/**
 * All Rooms logic
 *
 */
import { nanoid } from "nanoid";

import { firestoreDB } from "./firebase";
import helpers from "../helpers";

import { CommandTypes, MessageFormat, WsClient } from "../misc/types";

interface Rooms {
  join: Function;
  create: Function;
  leave: Function;
  getRoomsInfo: Function;
}

type Room = {};

type CreateRoomParams = {
  ownerId: string; // userId who created the room
  name: string; // room name
  description: string; // room description
};

type GetRoomsInfoParams = {
  uid: string; // user id
};

type joinRoomParams = {
  code: string;
  userId: string;
};

// getting all rooms
async function _getAllRooms() {
  try {
    const snapshot = await firestoreDB.collection("rooms").get();

    return snapshot.docs.map( doc => doc.data());

  } catch (error) {

    console.log(`[GETTING ROOMS ERR]: ${error}`);
    return null;
  }
}

const errorMessage: MessageFormat = {
  type: CommandTypes.ERROR_ROOM,
  params: {},
};

const createRoomHandler = async (params: CreateRoomParams, ws: WsClient) => {
  const code = nanoid(15); // room id
  const roomDetails = {
    ...params,
    code,
    createdAt: Date.now(), // date when the room was created
    members: [ws.userId],
  };

  try {
    // check whether the user exists
    const user = await helpers.getUser(params.ownerId);

    if (!user) {
      errorMessage.params!.message = `user with id ${params.ownerId} not found !`;
      ws.send(JSON.stringify(errorMessage));
      return;
    }

    const docRef = firestoreDB.collection("rooms").doc(roomDetails.code);
    await docRef.set(roomDetails);

    // automatically join your room
    ws.room = roomDetails.code;

    const response: MessageFormat = {
      type: CommandTypes.SUCCESS_ROOM,
      params: {
        message: `${roomDetails.name.substring(0, 15)} created successfully`,
      },
    };

    // send response if the room is created successfully
    ws.send(JSON.stringify(response));

    console.log(`[Creating Room]: ${params.name} created successfully`);
  } catch (error) {
    errorMessage.params!.message = `Failed to create ${roomDetails.name.substring(
      0,
      15
    )}... room `;

    console.log(`[Creating Room ERR]: ${error}`);

    ws.send(JSON.stringify(errorMessage));
  }
};

const getRoomsInfoHandler = async (
  params: GetRoomsInfoParams,
  ws: WsClient
) => {
  const { uid } = params;

  const rooms = await _getAllRooms();

  errorMessage.params!.message = "Failed to get rooms data";

  // if something went wrong while fetching rooms.
  // return error message
  if (!rooms) return ws.send(JSON.stringify(errorMessage));

  // respond to get_room_info command
  const payload: MessageFormat = {
    type: CommandTypes.GET_ROOMS_INFO, 
    params: { rooms },
  };

  // return rooms
  ws.send(JSON.stringify(payload));
  
};

const joinRoomHandler = () => {};

const leaveRoomHandler = () => {};

const rooms: Rooms = {
  create: createRoomHandler,
  join: joinRoomHandler,
  leave: leaveRoomHandler,
  getRoomsInfo: getRoomsInfoHandler,
};

export default rooms;
