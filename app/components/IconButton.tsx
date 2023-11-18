import Icon, { HasIcon } from "./Icon";
import { HasReactChildren } from "./commonInterfaces";

export interface IconButtonProps extends HasIcon, HasReactChildren {
  size?: number;
  openInNewTab?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function IconButton({
  iconKey,
  size,
  href,
  openInNewTab,
  onClick,
  children,
}: IconButtonProps) {
  const Wrapper = ({
    children,
    className,
  }: {
    children: any;
    className?: string;
  }) => {
    if (!href) {
      return <button {...{ className, onClick }}>{children}</button>;
    }
    const args = openInNewTab ? { target: "_blank", rel: "noreferrer" } : {};
    return <a {...{ className, href, ...args }}>{children}</a>;
  };

  return (
    <Wrapper className="iconButton">
      <Icon {...{ iconKey, size }} />
      {children}
    </Wrapper>
  );
}
