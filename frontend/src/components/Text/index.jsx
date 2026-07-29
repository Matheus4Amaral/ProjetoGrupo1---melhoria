import './styles.css'

export default function Text({
    children,
    className = "",
    ...props
}) {
    return (
        <p
            className={`text ${className}`}
            {...props}
        >
            {children}
        </p>
    )
}