function MyEvent({ event }) {
    return (
        <div>
            <strong>{event.title}</strong>
            {event.note && (
                <div className="text-xs truncate">{event.note}</div>
            )}
        </div>
    );
}

export default MyEvent

