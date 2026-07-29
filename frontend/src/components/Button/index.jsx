import './styles.css'

export default function Button({
    children,
    variant = "primary",
    loading = false,
    className = "",
    disabled,
    ...props
}) {
    return (
        <button
            className={`button button--${variant} ${className}`.trim()}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </button>
    )
}