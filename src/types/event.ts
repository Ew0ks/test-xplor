import { User } from "./user"

export type GithubEvent = {
  id: number
  created_at: string
  actor: User
  event: string
  commit_id?: string | null
  commit_url?: string | null
  label?: {
    name: string
    color: string
  }
  requested_reviewer?: User
  review_requester?: User
}
