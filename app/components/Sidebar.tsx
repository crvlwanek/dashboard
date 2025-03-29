import { Link, useLocation } from "@remix-run/react"
import Avatar from "./Avatar"
import Divider from "./Divider"
import IconButton from "./IconButton"
import { HasReactChildren } from "~/common/interfaces"
import avatarImage from "~/images/sunflowers.jpg"
import Icon from "./Icon"

type MenuItemProps = {
  to: string
  onClick?: () => void
} & HasReactChildren

const MenuItem = ({ to, onClick, children }: MenuItemProps) => {
  const location = useLocation()

  return (
    <li>
      <Link
        className={`hamburgerMenuLink ${location.pathname === to ? "selected" : ""}`}
        to={to}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  )
}

type SidebarProps = {
  open: boolean
  toggleOpen: () => void
}

const Sidebar = ({ open, toggleOpen }: SidebarProps) => {
  return (
    <>
      <div
        className={`fixed h-full bg-surface-alpha-800 backdrop-blur-md min-w-[150px] -translate-x-full z-10 ease-in-out transition-transform ${
          open ? "menuOpen" : ""
        }`}
        style={{ zIndex: 20 }}
      >
        <IconButton iconKey="close" onClick={toggleOpen} className="hamburgerCloseIcon" />
        <div className="hamburgerHeaderBox">
          <Avatar src={avatarImage} />
          <h2 className="navbarName">Chris Van Lanen-Wanek</h2>
          <h3 className="navbarJobTitle">Software Engineer | Web Developer</h3>
        </div>
        <Divider />
        <nav className="hamburgerNav">
          <ul>
            <MenuItem to="/" onClick={toggleOpen}>
              <Icon iconKey="home" />
              Home
            </MenuItem>
            <MenuItem to="/about-me" onClick={toggleOpen}>
              <Icon iconKey="profile" />
              About Me
            </MenuItem>
            <MenuItem to="/about" onClick={toggleOpen}>
              <Icon iconKey="world" />
              This Website
            </MenuItem>
          </ul>
        </nav>
      </div>
      {open && <div className="fixed inset-0 bg-black bg-opacity-30 z-10" onClick={toggleOpen} />}
    </>
  )
}

export default Sidebar
