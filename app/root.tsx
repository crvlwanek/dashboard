import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "@remix-run/react"

import generatedCss from "./generated.css"
import appCssHref from "./app.css"
import tailwindCss from "./tailwind.css"

import NavBar from "./components/NavBar"
import ThemeSwitcher from "./components/ThemeSwitcher"
import { useCallback, useEffect, useRef } from "react"
import MusicLogo from "./svg/MusicLogo"
import ProgressBar from "./components/ProgressBar"
import IconButton from "./components/IconButton"
import Sidebar from "./components/Sidebar"

import useToggle from "./hooks/useToggle"
import Footer from "./components/Footer"

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: generatedCss },
  { rel: "stylesheet", href: tailwindCss },
  { rel: "stylesheet", href: appCssHref },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap",
    rel: "stylesheet",
  },
]

const nonFloatingRoutes = ["/about"]

export default function App() {
  const nameBox = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { pathname } = location
  useEffect(() => {
    const mainHeader = document?.getElementById("mainHeader")

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!nameBox.current) {
          return
        }
        nameBox.current.classList.toggle(
          "navbarNameBoxShowing",
          !entry.isIntersecting || nonFloatingRoutes.some(route => route === pathname)
        )
      })
    })

    if (mainHeader) {
      observer.observe(mainHeader)
    }

    return () => observer.disconnect()
  }, [pathname])

  // Sidebar state
  const [open, toggleOpen] = useToggle(false)
  const toggleMenu = useCallback(() => {
    const body = document.getElementById("body")
    if (open) {
      body?.setAttribute("modal-open", "")
    } else {
      body?.removeAttribute("modal-open")
    }
    toggleOpen()
  }, [open])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body id="body">
        <ProgressBar />
        <Sidebar open={open} toggleOpen={toggleOpen} />
        <NavBar
          float={!nonFloatingRoutes.some(route => route === pathname)}
          className="dashboardNavbar px-2 sm:px-4"
        >
          <IconButton iconKey="hamburger" onClick={toggleMenu} />
          <div ref={nameBox} className="navbarNameBox">
            <MusicLogo className="musicIconNavbar" />
            <div style={{ marginLeft: 8, placeSelf: "center" }}>
              <h6 className="navbarName">Chris Van Lanen-Wanek</h6>
              <h6 className="navbarJobTitle">Software Engineer | Web Developer</h6>
            </div>
          </div>
          <ThemeSwitcher />
        </NavBar>
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  return (
    <html>
      <head>
        <title>Whoops! An error occurred</title>
        <Meta />
        <Links />
      </head>
      <body className="flex items-center justify-center h-screen">
        <div className="text-center p-4 outline-red-400 outline outline-2 bg-red-200">
          <div>Whoops!</div>
          <div>An unexpected error occurred</div>
        </div>
      </body>
    </html>
  )
}
