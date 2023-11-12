import Icon, { HasIcon } from "./Icon";

export interface IconButtonProps extends HasIcon {
  href?: string;
  size?: number;
}

export default function IconButton({ iconKey, size, href }: IconButtonProps) {
  const Wrapper = ({ children }: { children: any }) => {
    if (!href) {
      return <>{children}</>;
    }
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  };

  return (
    <Wrapper>
      <button className="iconButton">
        <Icon {...{ iconKey, size }} />
      </button>
    </Wrapper>
  );
}
