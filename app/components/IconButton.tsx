export interface SVGIconProps {
    className: string;
}

export interface IconButtonProps {
    Icon: React.FC<SVGIconProps>
}

export default function IconButton({ Icon }: IconButtonProps) {
    const svgClassName = "svgButtonIcon"

    return (
        <button className="iconButton">
            <Icon className={svgClassName} />
        </button>
    )
}