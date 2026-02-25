export default function GridIcon({ size = 24, className="text-[#8b93b7] hover:text-red-500 transition-colors"}) {
    return (
        <div
            className={`grid ${className}`}
            style={{
            width: size,
            height: size,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: size * 0.15,
            }}
        >
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                    backgroundColor: 'currentColor',
                    borderRadius: size * 0.08,
                }}
                />
            ))}
        </div>);
}