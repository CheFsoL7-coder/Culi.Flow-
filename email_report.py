# email_report.py

import smtplib
from email.mime.text import MIMEText
from datetime import datetime

def send_daily_report(to_email, completed, critical, compliance, pom):
    subject = f"Daily Culinary Ops Report - {datetime.now().strftime('%A, %b %d')}"
    body = f"""📋 Friendship Village - Daily Culinary Dashboard Summary

✔️ Completed Tasks: {completed}%
⚠️ Critical Task Completion: {critical}%
🔵 Compliance Coverage: {compliance}%
🟣 POM Alignment: {pom}%

Login for full details and task-level audit.

~ Executive Sous Dashboard
"""

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'noreply@friendshipvillage.local'
    msg['To'] = to_email

    try:
        with smtplib.SMTP('localhost') as server:
            server.send_message(msg)
        return "Email sent successfully"
    except Exception as e:
        return f"Failed to send email: {e}"
