import Avatar from "@mui/joy/Avatar"
import Chip from "@mui/joy/Chip"
import Select from "@mui/joy/Select"
import Option from "@mui/joy/Option"
import Divider from "@mui/joy/Divider"
import List from "@mui/joy/List"
import ListItem from "@mui/joy/ListItem"
import ListItemDecorator from "@mui/joy/ListItemDecorator"
import Sheet from "@mui/joy/Sheet"
import Typography from "@mui/joy/Typography"
import Input from "@mui/joy/Input"
import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { pipe, sort, descend, map } from "ramda"
import { useState } from "react"

import { Participant } from "./types/participant"
import { User } from "./types/user"

type SidebarProps = {
  participants?: Participant[]
  author?: User
  issues: Array<{ id: number; title: string }>
  selectedIssueId: number
  onIssueChange: (id: number) => void
}

export default function Sidebar({
  participants = [],
  author,
  issues = [],
  selectedIssueId,
  onIssueChange,
}: SidebarProps) {
  const [manualIssueId, setManualIssueId] = useState<string>("7901")

  const handleManualSubmit = () => {
    const id = parseInt(manualIssueId, 10)
    if (!isNaN(id)) {
      onIssueChange(id)
    }
  }

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
      <Select
        value={selectedIssueId}
        onChange={(_, value) => onIssueChange(value as number)}
        placeholder="Sélectionner une issue"
      >
        {issues.map((issue) => (
          <Option key={issue.id} value={issue.id}>
            #{issue.id} -{" "}
            {issue.title.length > 30
              ? `${issue.title.substring(0, 30)}...`
              : issue.title}
          </Option>
        ))}
      </Select>
      Ou
      <Stack direction="row" spacing={1}>
        <Input
          placeholder="ID de l'issue"
          value={manualIssueId}
          onChange={(e) => setManualIssueId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleManualSubmit()
            }
          }}
          sx={{ flex: 1 }}
        />
        <Button onClick={handleManualSubmit}>Charger</Button>
      </Stack>
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
