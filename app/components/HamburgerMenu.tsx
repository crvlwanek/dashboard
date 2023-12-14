import useToggle from "~/hooks/useToggle"
import IconButton from "./IconButton"
import Divider from "./Divider"
import Avatar from "./Avatar"
import { useCallback } from "react"
import { Link } from "@remix-run/react"
import Icon from "./Icon"

const avatarImage = "https://i.imgur.com/4Ouflwg.jpg"

export default function HamburgerMenu() {
  const [menuOpen, toggleMenuOpen] = useToggle(false)
  const toggleMenu = useCallback(() => {
    const body = document.getElementById("body")
    if (!menuOpen) {
      body?.setAttribute("modal-open", "")
    } else {
      body?.removeAttribute("modal-open")
    }
    toggleMenuOpen()
  }, [menuOpen])
  return (
    <>
      <IconButton iconKey="hamburger" onClick={toggleMenu} />
      <div className={`hamburgerMenu ${menuOpen ? "menuOpen" : ""}`}>
        <IconButton iconKey="close" onClick={toggleMenu} className="hamburgerCloseIcon" />
        <div className="hamburgerHeaderBox">
          <Avatar src={avatarImage} />
          <h2 className="navbarName">Chris Van Lanen-Wanek</h2>
          <h3 className="navbarJobTitle">Software Engineer | Web Developer</h3>
        </div>
        <Divider />
        <nav className="hamburgerNav">
          <ul>
            <li>
              <Link className="hamburgerMenuLink" to="/">
                <Icon iconKey="home" />
                Home
              </Link>
            </li>
            <li>
              <Link className="hamburgerMenuLink" to="/about-me">
                About Me
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, .3)", zIndex: 1 }}
          onClick={toggleMenu}
        />
      )}
    </>
  )
}
