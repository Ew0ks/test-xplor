import { User } from "./user"

export type Participant = User & {
  messageCount: number
}
