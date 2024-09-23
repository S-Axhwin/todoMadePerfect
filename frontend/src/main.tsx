import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
  }

createRoot(document.getElementById('root')!).render(
    <>
    <ThemeProvider defaultTheme="dark">
    <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInFallbackRedirectUrl="/tasks"
      signUpFallbackRedirectUrl="/newuser">
    <App />
    <Toaster />
    </ClerkProvider>
    </BrowserRouter>
    </ThemeProvider>
    </>

)
