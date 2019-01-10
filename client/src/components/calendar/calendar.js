import React, { useState, useEffect } from 'react';
import './calendar.css';

function Calendar() {
    const [calendar, setState] = useState([]);
    useEffect(() => {
        fetch('/api/calendar', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        })
            .then(res => res.json())
            .then(calendar => setState(calendar));
    }, []);

    return (
        <div>
            <h2>Calendar</h2>
            <ul>
                {calendar.map(calendar =>
                    <li key={calendar.id}>{calendar.start.dateTime} {calendar.summary}</li>
                )}
            </ul>
        </div>
    );
}

export default Calendar;
