import { User } from "./user"

export type Comment = {
  id: number
  created_at: string
  user: User
  body: string
}
