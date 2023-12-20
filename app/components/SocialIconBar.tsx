import IconButton from "./IconButton"

export default function SocialIconBar() {
  return (
    <div className="flex iconBox">
      <IconButton href="https://www.linkedin.com/in/crvlwanek/" iconKey="linkedIn" />
      <IconButton href="https://github.com/crvlwanek" iconKey="github" />
      <IconButton href="https://www.facebook.com/crvlwanek/" iconKey="facebook" />
      <IconButton href="https://www.instagram.com/crvlwanek/" iconKey="instagram" />
      <IconButton href="https://www.youtube.com/c/ChrisVLWanek" iconKey="youtube" />
    </div>
  )
}
