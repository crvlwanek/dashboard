import Icon, { HasIcon } from "./Icon";
import { HasClassName, HasReactChildren } from "./commonInterfaces";

export interface IconButtonProps
  extends HasIcon,
    HasReactChildren,
    HasClassName {
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
  className,
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
    <Wrapper className={`iconButton ${className}`}>
      <Icon {...{ iconKey, size }} />
      {children}
    </Wrapper>
  );
}
