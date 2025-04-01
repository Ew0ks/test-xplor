import { useMemo } from "react"
import { isNilOrEmpty, isNotNilOrEmpty } from "ramda-adjunct"
import { reduce, values, propOr, pathOr } from "ramda"
import useFetch from "../../useFetch"
import { Issue } from "../../types/issue"
import { Comment } from "../../types/comment"
import { GithubEvent } from "../../types/event"
import { Participant } from "../../types/participant"

export function useIssue(issueId: number | null) {
  const issue = useFetch<Issue>(
    {
      url: issueId
        ? `https://api.github.com/repos/facebook/react/issues/${issueId}`
        : undefined,
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { enabled: isNotNilOrEmpty(issueId) }
  )

  const comments = useFetch<Comment[]>(
    {
      url: issue.data?.comments_url,
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { enabled: issue.isFetched }
  )

  const events = useFetch<GithubEvent[]>(
    {
      url: issue.data?.events_url,
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { enabled: issue.isFetched }
  )

  const participants = useMemo<Participant[]>(() => {
    if (isNilOrEmpty(comments.data)) return []

    const userCounts = reduce<Comment, Record<string, Participant>>(
      (acc, comment) => {
        const login = pathOr("", ["user", "login"], comment)
        const existing = propOr({ messageCount: 0 }, login, acc)

        return {
          ...acc,
          [login]: {
            login: comment.user.login,
            avatar_url: comment.user.avatar_url,
            messageCount: (pathOr(0, ["messageCount"], existing) || 0) + 1,
          },
        }
      },
      {},
      comments.data ?? []
    )

    return isNilOrEmpty(userCounts) ? [] : values(userCounts)
  }, [comments.data])

  return {
    issue,
    comments,
    events,
    participants,
  }
}
