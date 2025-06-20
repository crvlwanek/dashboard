import { HasClassName } from "~/common/interfaces"
import Divider from "./Divider"

type LargeDividerHeaderProps = {
  title: string
} & HasClassName

const LargeDividerHeader: React.FC<LargeDividerHeaderProps> = ({ title, className }) => {
  return (
    <div className={`flex w-full items-center ${className}`}>
      <Divider />
      <h2 className="whitespace-nowrap text-3xl p-4">{title}</h2>
      <Divider />
    </div>
  )
}

export default LargeDividerHeader
