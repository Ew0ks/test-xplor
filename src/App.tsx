import Box from "@mui/joy/Box"
import CssBaseline from "@mui/joy/CssBaseline"
import { CssVarsProvider } from "@mui/joy/styles"
import { isNilOrEmpty, isNotNilOrEmpty } from "ramda-adjunct"
import { reduce, values, propOr, pathOr, map, reject, includes } from "ramda"
import { useMemo, useState } from "react"

import MessagesPane from "./MessagesPane"
import Sidebar from "./Sidebar"
import useFetch from "./useFetch"
import { Comment } from "./types/comment"
import { Issue } from "./types/issue"
import { Participant } from "./types/participant"

function App() {
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null)
  const [filteredParticipants, setFilteredParticipants] = useState<string[]>([])

  const toggleParticipantFilter = (login: string) => {
    setFilteredParticipants((current) =>
      current.includes(login)
        ? current.filter((item) => item !== login)
        : [...current, login]
    )
  }

  const issues = useFetch<Issue[]>({
    url: "https://api.github.com/repos/facebook/react/issues",
    headers: {
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  })

  const issue = useFetch<Issue>(
    {
      url: `https://api.github.com/repos/facebook/react/issues/${selectedIssueId}`,
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { enabled: isNotNilOrEmpty(selectedIssueId) }
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

  const issuesList = useMemo<Array<{ id: number; title: string }>>(() => {
    if (isNilOrEmpty(issues.data)) return []

    return map(
      (issue) => ({ id: issue.number, title: issue.title }),
      issues.data ?? []
    )
  }, [issues.data])

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

  // Filtrer les commentaires en fonction des participants sélectionnés
  const filteredComments = useMemo(() => {
    if (isNilOrEmpty(comments.data) || isNilOrEmpty(filteredParticipants))
      return comments.data

    return reject((comment: Comment) =>
      includes(comment.user.login, filteredParticipants)
    )(comments.data ?? [])
  }, [comments.data, filteredParticipants])

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box component="aside" sx={{ width: 300 }}>
          <Sidebar
            participants={participants}
            author={issue.data?.user}
            issues={issuesList}
            selectedIssueId={selectedIssueId}
            onIssueChange={setSelectedIssueId}
            filteredParticipants={filteredParticipants}
            onParticipantToggle={toggleParticipantFilter}
          />
        </Box>
        <Box component="main" sx={{ flex: 1 }}>
          <MessagesPane
            issue={issue.data}
            comments={filteredComments}
            error={issue.error}
            isIssueLoading={issue.isLoading}
            areCommentsLoading={comments.isLoading}
          />
        </Box>
      </Box>
    </CssVarsProvider>
  )
}

export default App
