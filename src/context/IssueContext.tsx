import { createContext, useContext, useState, ReactNode, useMemo } from "react"
import { filter, includes, map, reject } from "ramda"
import { isNilOrEmpty } from "ramda-adjunct"
import { useIssue } from "../api/hooks/useIssue"
import { useTimelineItems } from "../features/issueViewer/hooks/useTimelineItems"
import { Issue } from "../types/issue"
import { Comment } from "../types/comment"
import { GithubEvent } from "../types/event"
import { Participant } from "../types/participant"

type IssueContextType = {
  selectedIssueId: number | null
  setSelectedIssueId: (id: number | null) => void
  filteredParticipants: string[]
  toggleParticipantFilter: (login: string) => void
  issue: {
    data?: Issue
    isLoading: boolean
    error: Error | null
    isFetched: boolean
  }
  comments: {
    data?: Comment[]
    isLoading: boolean
    error: Error | null
  }
  events: {
    data?: GithubEvent[]
    isLoading: boolean
    error: Error | null
  }
  issuesList: Array<{ id: number; title: string }>
  participants: Participant[]
  filteredComments?: Comment[]
  timelineItems: Array<{
    type: "comment" | "event"
    data: Comment | GithubEvent
    created_at: string
  }>
}

const IssueContext = createContext<IssueContextType | undefined>(undefined)

export function useIssueContext() {
  const context = useContext(IssueContext)
  if (context === undefined) {
    throw new Error("useIssueContext must be used within an IssueProvider")
  }
  return context
}

export function IssueProvider({ children }: { children: ReactNode }) {
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null)
  const [filteredParticipants, setFilteredParticipants] = useState<string[]>([])

  const toggleParticipantFilter = (login: string) => {
    setFilteredParticipants((participants) =>
      includes(login, participants)
        ? filter((item) => item !== login, participants)
        : [...participants, login]
    )
  }

  const { issues, issue, comments, events, participants } =
    useIssue(selectedIssueId)

  const issuesList = useMemo(() => {
    if (isNilOrEmpty(issues.data)) return []
    return map(
      (issue) => ({ id: issue.number, title: issue.title }),
      issues.data ?? []
    )
  }, [issues.data])

  const filteredComments = useMemo(() => {
    if (isNilOrEmpty(comments.data) || isNilOrEmpty(filteredParticipants))
      return comments.data

    return reject((comment: Comment) =>
      includes(comment.user.login, filteredParticipants)
    )(comments.data ?? [])
  }, [comments.data, filteredParticipants])

  const timelineItems = useTimelineItems(filteredComments, events.data)

  const value = {
    selectedIssueId,
    setSelectedIssueId,
    filteredParticipants,
    toggleParticipantFilter,
    issue,
    comments,
    events,
    issuesList,
    participants,
    filteredComments,
    timelineItems,
  }

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>
}
