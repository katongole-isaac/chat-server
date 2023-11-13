/**
 * Friend Request Interface
 *
 */

import { Timestamp } from "firebase-admin/firestore";

export default interface FriendRequest {
  /**
   * Recipient id
   */
  readonly to: string;

  /**
   * Sender id
   */
  readonly from: string;
}

export interface NewFriendRequest {
  readonly sender: string;
  readonly recipient: string;
  
  /**
   * Denotes the date when the request was created
   */
  readonly createdAt: Timestamp ; 
}
