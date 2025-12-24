# calendar_export.py

from icalendar import Calendar, Event
from datetime import datetime, timedelta
import pytz

def generate_ical(events, filename="daily_tasks.ics"):
    cal = Calendar()
    cal.add('prodid', '-//Friendship Village Scheduler//')
    cal.add('version', '2.0')

    tz = pytz.timezone('America/Chicago')

    for event in events:
        e = Event()
        start_time = tz.localize(datetime.strptime(event['start'], "%Y-%m-%d %H:%M"))
        end_time = tz.localize(datetime.strptime(event['end'], "%Y-%m-%d %H:%M"))
        e.add('summary', event['title'])
        e.add('dtstart', start_time)
        e.add('dtend', end_time)
        e.add('description', event.get('description', ''))
        cal.add_component(e)

    with open(filename, 'wb') as f:
        f.write(cal.to_ical())

    return filename
