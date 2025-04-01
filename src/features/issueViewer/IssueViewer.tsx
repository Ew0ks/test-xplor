import Box from "@mui/joy/Box"
import { useIssueContext } from "../../context/IssueContext"
import MessagesPane from "../../ui/MessagesPane"
import Sidebar from "../../ui/Sidebar"

export default function IssueViewer() {
  const {
    selectedIssueId,
    setSelectedIssueId,
    issue,
    filteredParticipants,
    toggleParticipantFilter,
    participants,
    issuesList,
    timelineItems,
    comments,
    events,
  } = useIssueContext()

  return (
    <>
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
          timelineItems={timelineItems}
          error={issue.error}
          isIssueLoading={issue.isLoading}
          areCommentsLoading={comments.isLoading || events.isLoading}
        />
      </Box>
    </>
  )
}
