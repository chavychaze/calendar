import React, { Component } from 'react';
import './calendar.css';

class Calendar extends Component {
    constructor() {
        super();
        this.state = {
            calendar: []
        }
    }

    componentDidMount() {
        fetch('/api/calendar', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
      
          })
            .then(res => res.json())
            // .then(text => console.log(text));
            .then(calendar => this.setState({ calendar }, () => console.log('Calendar fetched...', calendar)));
    }

    render() {
        return (
            <div>
                <h2>Calendar</h2>
                <ul>
                    {this.state.calendar.map(calendar => 
                        <li key={calendar.id}>{calendar.start.dateTime} {calendar.summary}</li>
                        )}
                </ul>
            </div>
        );
    }
}

export default Calendar;
