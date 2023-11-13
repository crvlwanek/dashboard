import { HasClassName } from "./commonInterfaces";

interface NavBarProps extends HasClassName {}

export default function NavBar({ className }: NavBarProps) {
  return <nav className={`navbar ${className}`}></nav>;
}
