import ChevronLeftIcon from "~/svg/ChevronLeftIcon"
import ChevronRightIcon from "~/svg/ChevronRightIcon"
import FacebookIcon from "~/svg/FacebookIcon"
import GitHubIcon from "~/svg/GitHubIcon"
import InstagramIcon from "~/svg/InstagramIcon"
import LinkedInIcon from "~/svg/LinkedInIcon"
import MoonIcon from "~/svg/MoonIcon"
import SettingsIcon from "~/svg/SettingsIcon"
import SunIcon from "~/svg/SunIcon"
import ThemeIcon from "~/svg/ThemeIcon"
import YouTubeIcon from "~/svg/YouTubeIcon"

const iconKeys = {
  facebook: FacebookIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
  linkedIn: LinkedInIcon,
  youtube: YouTubeIcon,
  sun: SunIcon,
  moon: MoonIcon,
  settings: SettingsIcon,
  theme: ThemeIcon,
  chevronRight: ChevronRightIcon,
  chevronLeft: ChevronLeftIcon,
}

export type IconKey = keyof typeof iconKeys
export interface HasIcon {
  iconKey: IconKey
}

interface IconProps extends HasIcon {
  size?: number
}

export default function Icon({ iconKey, size }: IconProps) {
  size ??= 20

  const IconComponent = iconKeys[iconKey]

  return (
    <div className="iconWrapper" style={{ height: size, width: size }}>
      <IconComponent />
    </div>
  )
}
