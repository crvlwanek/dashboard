import SocialIconBar from "./SocialIconBar"

const Footer = () => {
  return (
    <footer className="h-[150px] flex-col align-center justify-center mb-4">
      <SocialIconBar />
      <p>© {new Date().getFullYear()}, Chris VL-Wanek</p>
      <a
        href="https://github.com/crvlwanek/dashboard"
        rel="noreferrer"
        target="_blank"
        className="text-primary-main hover:underline"
      >
        View the GitHub repo
      </a>
    </footer>
  )
}

export default Footer
