import Box from "@mui/joy/Box"
import ReactMarkdown from "react-markdown"
import Sheet from "@mui/joy/Sheet"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { Avatar } from "@mui/joy"

import { Comment } from "../types/comment"

type ChatBubbleProps = Comment & {
  variant: "solid" | "outlined"
}

export default function ChatBubble({
  body,
  variant,
  created_at,
  user,
}: ChatBubbleProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar size="sm" variant="solid" src={user.avatar_url} />
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 0.25 }}>
          <Typography level="body-xs" fontWeight="bold">
            {user.login}
          </Typography>
          <Typography level="body-xs">
            {new Date(created_at).toLocaleString()}
          </Typography>
        </Stack>
        <Box>
          <Sheet
            color="primary"
            variant={variant}
            invertedColors={variant === "solid"}
            sx={{
              p: 1.25,
              borderRadius: "lg",
              borderTopLeftRadius: 0,
            }}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <Typography level="body-sm" color="primary">
                    {children}
                  </Typography>
                ),
                a: ({ href, children }) => (
                  <Typography
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener"
                    color="primary"
                    sx={{ textDecoration: "underline" }}
                  >
                    {children}
                  </Typography>
                ),
                code: ({ children }) => (
                  <Typography
                    level="body-sm"
                    color="primary"
                    sx={{
                      fontFamily: "monospace",
                      backgroundColor:
                        variant === "solid"
                          ? "rgba(0,0,0,0.1)"
                          : "rgba(0,0,0,0.05)",
                      px: 0.5,
                      borderRadius: "sm",
                    }}
                  >
                    {children}
                  </Typography>
                ),
              }}
            >
              {body}
            </ReactMarkdown>
          </Sheet>
        </Box>
      </Box>
    </Stack>
  )
}
