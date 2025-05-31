export default function MyEvent({ event }) {
    return (
        <div data-cy="calendar-event">
            <strong>{event.title}</strong>
            {event.note && (
                <div className="text-xs truncate">{event.note}</div>
            )}
        </div>
    );
}
