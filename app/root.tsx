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
} from "@remix-run/react"

import appCssHref from "./app.css"
import tailwindCss from "./tailwind.css"
import NavBar from "./components/NavBar"
import ThemeSwitcher from "./components/ThemeSwitcher"
import { useEffect, useRef } from "react"
import MusicLogo from "./svg/MusicLogo"
import HamburgerMenu from "./components/HamburgerMenu"

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindCss },
  { rel: "stylesheet", href: appCssHref },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;500&display=swap",
    rel: "stylesheet",
  },
]

export default function App() {
  const nameBox = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useEffect(() => {
    const mainHeader = document?.getElementById("mainHeader")

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!nameBox.current) {
          return
        }
        nameBox.current.classList.toggle("navbarNameBoxShowing", !entry.isIntersecting)
      })
    })

    if (mainHeader) {
      observer.observe(mainHeader)
    }

    return () => observer.disconnect()
  }, [location.pathname])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body id="body">
        <NavBar float className="dashboardNavbar px-2 sm:px-4">
          <HamburgerMenu />
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
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
