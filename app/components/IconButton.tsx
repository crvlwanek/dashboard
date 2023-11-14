import Icon, { HasIcon } from "./Icon";

export interface IconButtonProps extends HasIcon {
  href?: string;
  size?: number;
}

export default function IconButton({ iconKey, size, href }: IconButtonProps) {
  const Wrapper = ({
    children,
    className,
  }: {
    children: any;
    className?: string;
  }) => {
    if (!href) {
      return <button className={className}>{children}</button>;
    }
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  };

  return (
    <Wrapper className="iconButton">
      <Icon {...{ iconKey, size }} />
    </Wrapper>
  );
}
