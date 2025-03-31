import Avatar from "@mui/joy/Avatar"
import Chip from "@mui/joy/Chip"
import Input from "@mui/joy/Input"
import Divider from "@mui/joy/Divider"
import List from "@mui/joy/List"
import ListItem from "@mui/joy/ListItem"
import ListItemDecorator from "@mui/joy/ListItemDecorator"
import Sheet from "@mui/joy/Sheet"
import Typography from "@mui/joy/Typography"
import { pipe, sort, descend, map } from "ramda"

import { Participant } from "./types/participant"
import { User } from "./types/user"

type SidebarProps = {
  participants?: Participant[]
  author?: User
}

export default function Sidebar({ participants = [], author }: SidebarProps) {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: "sticky",
        transition: "transform 0.4s, width 0.4s",
        height: "100dvh",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Input value="facebook/react/issues/7901" />

      {author && (
        <>
          <Typography level="title-lg">Auteur</Typography>
          <ListItem>
            <ListItemDecorator sx={{ mr: 1 }}>
              <Avatar src={author.avatar_url} />
            </ListItemDecorator>
            {author.login}
          </ListItem>
          <Divider />
        </>
      )}

      <Typography level="title-lg">Participants</Typography>
      <List>
        {pipe(
          sort(descend((p: Participant) => p.messageCount)),
          map((participant: Participant) => (
            <ListItem key={participant.login}>
              <ListItemDecorator sx={{ mr: 1 }}>
                <Avatar src={participant.avatar_url} />
              </ListItemDecorator>
              {participant.login}
              <Chip
                size="sm"
                variant="soft"
                color="primary"
                sx={{ ml: "auto" }}
              >
                {participant.messageCount}
              </Chip>
            </ListItem>
          ))
        )(participants)}
      </List>
    </Sheet>
  )
}
