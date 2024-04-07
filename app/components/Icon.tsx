import { HasClassName } from "./commonInterfaces"

import ChevronLeftIcon from "~/svg/ChevronLeftIcon"
import ChevronRightIcon from "~/svg/ChevronRightIcon"
import FacebookIcon from "~/svg/FacebookIcon"
import GitHubIcon from "~/svg/GitHubIcon"
import InstagramIcon from "~/svg/InstagramIcon"
import LinkedInIcon from "~/svg/LinkedInIcon"
import MoonIcon from "~/svg/MoonIcon"
import SettingsIcon from "~/svg/SettingsIcon"
import ShoeIcon from "~/svg/ShoeIcon"
import SunIcon from "~/svg/SunIcon"
import ThemeIcon from "~/svg/ThemeIcon"
import YouTubeIcon from "~/svg/YouTubeIcon"
import HamburgerIcon from "~/svg/HamburgerIcon"
import CloseIcon from "~/svg/CloseIcon"
import HomeIcon from "~/svg/HomeIcon"
import ProfileIcon from "~/svg/ProfileIcon"
import WeightliftingIcon from "~/svg/WeightliftingIcon"
import WorldIcon from "~/svg/WorldIcon"

const iconKeys = {
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  close: CloseIcon,
  facebook: FacebookIcon,
  github: GitHubIcon,
  hamburger: HamburgerIcon,
  home: HomeIcon,
  instagram: InstagramIcon,
  linkedIn: LinkedInIcon,
  moon: MoonIcon,
  profile: ProfileIcon,
  settings: SettingsIcon,
  shoe: ShoeIcon,
  sun: SunIcon,
  theme: ThemeIcon,
  weightlifting: WeightliftingIcon,
  world: WorldIcon,
  youtube: YouTubeIcon,
}

export type IconKey = keyof typeof iconKeys
export interface HasIcon {
  iconKey: IconKey
}

interface IconProps extends HasIcon, HasClassName {
  size?: number
}

export default function Icon({ iconKey, size, className }: IconProps) {
  size ??= 20

  const IconComponent = iconKeys[iconKey]

  return (
    <div className={`iconWrapper ${className}`} style={{ height: size, width: size }}>
      <IconComponent />
    </div>
  )
}
