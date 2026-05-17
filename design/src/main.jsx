import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Scrollbar from './components/Scrollbar.jsx'
import './index.css'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const ProjectPage = lazy(() => import('./pages/ProjectPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const PageTransition = lazy(() => import('./components/PageTransition.jsx'))
const Cursor = lazy(() => import('./components/Cursor.jsx'))

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Suspense fallback={null}><Landing /></Suspense>} />
        <Route path="/work/:slug" element={<Suspense fallback={null}><ProjectPage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
      </Routes>
      {/* Lives outside Routes so it can play on every navigation regardless of
          which page is mounting / unmounting. */}
      <Suspense fallback={null}>
        <PageTransition />
      </Suspense>
      <Scrollbar />
      <Suspense fallback={null}>
        <Cursor />
      </Suspense>
      {/* Guaranteed top-level grain overlay to ensure texture shows above
          content regardless of stacking contexts. */}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
