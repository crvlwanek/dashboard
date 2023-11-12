export interface AvatarProps {
    size?: number;
    src: string;
}

export default function Avatar({ size, src }: AvatarProps) {
    // Set default values
    size ??= 100;

    return (
        <img 
            className={`avatarImage ${size > 100 ? "large" : ""}`} 
            height={size} 
            width={size} 
            src={src}
        />
    )
}