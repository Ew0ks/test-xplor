import Chip from "@mui/joy/Chip"
import Sheet from "@mui/joy/Sheet"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { always, ifElse, map } from "ramda"
import { isNotNil } from "ramda-adjunct"

import ChatBubble from "./ChatBubble"
import { Comment } from "./types/comment"
import { Issue } from "./types/issue"

type MessagesPaneProps = {
  issue?: Issue
  comments?: Comment[]
}

export default function MessagesPane({ issue, comments }: MessagesPaneProps) {
  const isUserAuthor = (comment: Comment) =>
    comment.user.login === issue?.user?.login
  const getVariant = ifElse(
    isUserAuthor,
    always<"solid">("solid"),
    always<"outlined">("outlined")
  )

  return (
    <Sheet
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      {isNotNil(issue) && (
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.body",
          }}
          py={{ xs: 2, md: 2 }}
          px={{ xs: 1, md: 2 }}
        >
          <Typography
            fontWeight="lg"
            fontSize="lg"
            component="h2"
            noWrap
            endDecorator={
              <Chip
                variant="outlined"
                size="sm"
                color="neutral"
                sx={{ borderRadius: "sm" }}
              >
                #{issue.number}
              </Chip>
            }
          >
            {issue.title}
          </Typography>
          <Typography level="body-sm">{issue.user.login}</Typography>
        </Stack>
      )}
      {isNotNil(comments) && (
        <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
          <ChatBubble variant="solid" {...issue!} />
          {map(
            (comment: Comment) => (
              <ChatBubble
                key={comment.id}
                variant={getVariant(comment)}
                {...comment}
              />
            ),
            comments
          )}
        </Stack>
      )}
    </Sheet>
  )
}
