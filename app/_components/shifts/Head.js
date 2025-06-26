export default function Head({ children, colTemplate }) {

    return (
        <head className="sticky top-0 z-30 grid"
            style={{ gridTemplateColumns: colTemplate }}>
            {children}
        </head>
    )
}