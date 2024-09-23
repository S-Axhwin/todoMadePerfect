import { SignedIn } from "@clerk/clerk-react"
import Nav from "./components/Nav"
import { Routes, Route } from "react-router-dom"
import Tasks from "./pages/tasks"
import NewUsr from "./pages/NewUsr"

const App = () => {
  return (
    <div>
        <Nav />
        <Routes>
        <Route path="/" element={<div>This page is publicly accessible.</div>} />
        <Route path="/tasks"  element={
            <SignedIn>
                <Tasks />
            </SignedIn>
        } />
        <Route path="/newuser"  element={
            <SignedIn>
                <NewUsr />
            </SignedIn>
        } />
      </Routes>
    </div>
  )
}

export default App
