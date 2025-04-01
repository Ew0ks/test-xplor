const API_BASE_URL = "https://api.github.com"
const AUTH_HEADERS = {
  Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
}

export const githubApi = {
  getIssue: (issueId: number) => ({
    url: `${API_BASE_URL}/repos/facebook/react/issues/${issueId}`,
    headers: AUTH_HEADERS,
  }),

  getIssues: () => ({
    url: `${API_BASE_URL}/repos/facebook/react/issues`,
    headers: AUTH_HEADERS,
  }),

  getComments: (commentsUrl: string) => ({
    url: commentsUrl,
    headers: AUTH_HEADERS,
  }),

  getEvents: (eventsUrl: string) => ({
    url: eventsUrl,
    headers: AUTH_HEADERS,
  }),
}
