import { HasClassName, HasReactChildren } from "./commonInterfaces";

interface NavBarProps extends HasClassName, HasReactChildren {}

export default function NavBar({ className, children }: NavBarProps) {
  return <header className={`navbar ${className}`}>{children}</header>;
}
