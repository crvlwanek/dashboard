import FacebookIcon from "~/svg/FacebookIcon";
import GitHubIcon from "~/svg/GitHubIcon";
import InstagramIcon from "~/svg/InstagramIcon";
import LinkedInIcon from "~/svg/LinkedInIcon";
import YouTubeIcon from "~/svg/YouTubeIcon";

const iconKeys = {
  facebook: FacebookIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
  linkedIn: LinkedInIcon,
  youtube: YouTubeIcon,
};

export type IconKey = keyof typeof iconKeys;
export interface HasIcon {
  iconKey: IconKey;
}

interface IconProps extends HasIcon {
  size?: number;
}

export default function Icon({ iconKey, size }: IconProps) {
  size ??= 20;

  const IconComponent = iconKeys[iconKey];

  return (
    <div className="iconWrapper" style={{ height: size, width: size }}>
      <IconComponent />
    </div>
  );
}