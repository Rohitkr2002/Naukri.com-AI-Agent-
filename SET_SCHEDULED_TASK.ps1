# --- Windows Scheduled Task Setup ---
$TaskName = "Naukri_AI_Daily_Dashboard"
$ActionScript = "c:\Users\rajpu\Desktop\Nukari.com\LAUNCH_DASHBOARD.bat"
$Time = "10:00AM"

# Create the action
$Action = New-ScheduledTaskAction -Execute $ActionScript -WorkingDirectory "c:\Users\rajpu\Desktop\Nukari.com"

# Create the trigger (Daily at 10:00 AM)
$Trigger = New-ScheduledTaskTrigger -Daily -At $Time

# Register the task
Register-ScheduledTask -Action $Action -Trigger $Trigger -TaskName $TaskName -Description "Daily Naukri AI Agent Job Sync & Dashboard Launch" -Force

Write-Host "SUCCESS: Dashboard scheduled to run every day at $Time"
Write-Host "You can change the time in Task Scheduler under $TaskName"
