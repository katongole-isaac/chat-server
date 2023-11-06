/**
 * Friend Request Interface
 *
 */

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
//   createdAt: date ; the date is used when saving the document in DB
}
