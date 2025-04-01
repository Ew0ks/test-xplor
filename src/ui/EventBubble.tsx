import Avatar from "@mui/joy/Avatar"
import Box from "@mui/joy/Box"
import Chip from "@mui/joy/Chip"
import Typography from "@mui/joy/Typography"

import { GithubEvent } from "../types/event"

export default function EventBubble({
  created_at,
  actor,
  event: eventType,
  label,
  requested_reviewer,
}: GithubEvent) {
  const getEventMessage = () => {
    switch (eventType) {
      case "labeled":
        return (
          <>
            <Typography component="span" fontWeight="lg">
              {actor.login}
            </Typography>{" "}
            a ajouté le label{" "}
            <Chip
              size="sm"
              variant="soft"
              color="primary"
              sx={{
                backgroundColor: `#${label?.color}`,
                color:
                  parseInt(label?.color || "fff", 16) > 0xffffff / 2
                    ? "#000"
                    : "#fff",
              }}
            >
              {label?.name}
            </Chip>
          </>
        )
      case "review_requested":
        return (
          <>
            <Typography component="span" fontWeight="lg">
              {actor.login}
            </Typography>{" "}
            a demandé une revue à{" "}
            <Typography component="span" fontWeight="lg">
              {requested_reviewer?.login}
            </Typography>
          </>
        )
      case "deployed":
        return (
          <>
            <Typography component="span" fontWeight="lg">
              {actor.login}
            </Typography>{" "}
            a déployé cette pull request
          </>
        )
      case "head_ref_force_pushed":
        return (
          <>
            <Typography component="span" fontWeight="lg">
              {actor.login}
            </Typography>{" "}
            a force-push cette pull request
          </>
        )
      default:
        return (
          <>
            <Typography component="span" fontWeight="lg">
              {actor.login}
            </Typography>{" "}
            a effectué l'action <code>{eventType}</code>
          </>
        )
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderRadius: "sm",
        bgcolor: "background.level1",
        border: "1px dashed",
        borderColor: "divider",
        fontSize: "sm",
      }}
    >
      <Avatar size="sm" src={actor.avatar_url} />
      <Box sx={{ fontSize: "sm" }}>
        {getEventMessage()}
        <Typography level="body-xs" sx={{ mt: 1, color: "text.tertiary" }}>
          {new Date(created_at).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  )
}
