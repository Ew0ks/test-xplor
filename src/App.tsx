import Box from "@mui/joy/Box"
import CssBaseline from "@mui/joy/CssBaseline"
import { CssVarsProvider } from "@mui/joy/styles"
import { IssueProvider } from "./context/IssueContext"
import IssueViewer from "./features/issueViewer/IssueViewer"

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <IssueProvider>
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <IssueViewer />
        </Box>
      </IssueProvider>
    </CssVarsProvider>
  )
}

export default App
