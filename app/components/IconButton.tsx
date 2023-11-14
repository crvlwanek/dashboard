import Icon, { HasIcon } from "./Icon";

export interface IconButtonProps extends HasIcon {
  href?: string;
  size?: number;
  openInNewTab?: boolean;
}

export default function IconButton({
  iconKey,
  size,
  href,
  openInNewTab,
}: IconButtonProps) {
  const Wrapper = ({
    children,
    className,
  }: {
    children: any;
    className?: string;
  }) => {
    if (!href) {
      return <button {...{ className }}>{children}</button>;
    }
    const args = openInNewTab ? { target: "_blank", rel: "noreferrer" } : {};
    return <a {...{ className, href, ...args }}>{children}</a>;
  };

  return (
    <Wrapper className="iconButton">
      <Icon {...{ iconKey, size }} />
    </Wrapper>
  );
}
