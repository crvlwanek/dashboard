export interface DividerProps {
  vertical?: boolean;
}

export default function Divider({ vertical }: DividerProps) {
  return <hr className={vertical ? "vertical" : ""} />;
}
