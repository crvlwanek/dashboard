import useToggle from "~/hooks/useToggle"
import IconButton from "./IconButton"
import Divider from "./Divider"
import Avatar from "./Avatar"

const avatarImage = "https://i.imgur.com/4Ouflwg.jpg"

export default function HamburgerMenu() {
  const [menuOpen, toggleMenuOpen] = useToggle(false)
  return (
    <>
      <IconButton iconKey="hamburger" onClick={toggleMenuOpen} />
      <div className={`hamburgerMenu ${menuOpen ? "menuOpen" : ""}`}>
        <IconButton iconKey="close" onClick={toggleMenuOpen} className="hamburgerCloseIcon" />
        <div className="hamburgerHeaderBox">
          <Avatar src={avatarImage} />
          <h2 className="navbarName">Chris Van Lanen-Wanek</h2>
          <h3 className="navbarJobTitle">Software Engineer | Web Developer</h3>
        </div>
        <Divider />
        <nav>
          <ul>
            <li>
              <a>About Me</a>
            </li>
          </ul>
        </nav>
      </div>
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, .3)", zIndex: 1 }}
          onClick={toggleMenuOpen}
        />
      )}
    </>
  )
}
