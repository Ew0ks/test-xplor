import { useMemo } from "react"
import { isNilOrEmpty } from "ramda-adjunct"
import { map, sort } from "ramda"
import { Comment } from "../../../types/comment"
import { GithubEvent } from "../../../types/event"

export function useTimelineItems(
  comments: Comment[] | undefined,
  events: GithubEvent[] | undefined
) {
  return useMemo(() => {
    if (isNilOrEmpty(comments) && isNilOrEmpty(events)) return []

    const commentItems = map(
      (comment) => ({
        type: "comment" as const,
        data: comment,
        created_at: comment.created_at,
      }),
      comments ?? []
    )

    const eventItems = map(
      (event) => ({
        type: "event" as const,
        data: event,
        created_at: event.created_at,
      }),
      events ?? []
    )

    return sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      [...commentItems, ...eventItems]
    )
  }, [comments, events])
}
