import Box from "@mui/joy/Box"
import CssBaseline from "@mui/joy/CssBaseline"
import { CssVarsProvider } from "@mui/joy/styles"
import { isNilOrEmpty } from "ramda-adjunct"
import { reduce, values, propOr, pathOr } from "ramda"
import { useMemo } from "react"

import MessagesPane from "./MessagesPane"
import Sidebar from "./Sidebar"
import useFetch from "./useFetch"
import { Comment } from "./types/comment"
import { Issue } from "./types/issue"
import { Participant } from "./types/participant"

function App() {
  const issue = useFetch<Issue>({
    url: "https://api.github.com/repos/facebook/react/issues/7901",
  })
  const comments = useFetch<Comment[]>(
    { url: issue.data?.comments_url },
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

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box component="aside" sx={{ width: 300 }}>
          <Sidebar participants={participants} author={issue.data?.user} />
        </Box>
        <Box component="main" sx={{ flex: 1 }}>
          <MessagesPane issue={issue.data} comments={comments.data} />
        </Box>
      </Box>
    </CssVarsProvider>
  )
}

export default App
