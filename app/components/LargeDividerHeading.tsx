import Divider from "./Divider"

type LargeDividerHeaderProps = {
  title: string
}

const LargeDividerHeader: React.FC<LargeDividerHeaderProps> = ({ title }) => {
  return (
    <div className="flex w-full items-center">
      <Divider />
      <h2 className="whitespace-nowrap text-3xl p-4">{title}</h2>
      <Divider />
    </div>
  )
}

export default LargeDividerHeader
