/**
 * User properties
 *
 */
export interface User {
  readonly socket_id: string;
  readonly userId: string;
  readonly email: string;
  readonly friends: string[];
}
