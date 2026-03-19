Set oWS = WScript.CreateObject("WScript.Shell")
strStartupPath = oWS.SpecialFolders("Startup")
strShortcutPath = strStartupPath & "\NaukriAI_Dashboard.lnk"
Set oLink = oWS.CreateShortcut(strShortcutPath)
oLink.TargetPath = "c:\Users\rajpu\Desktop\Nukari.com\LAUNCH_DASHBOARD.bat"
oLink.WorkingDirectory = "c:\Users\rajpu\Desktop\Nukari.com"
oLink.WindowStyle = 1
oLink.Save
WScript.Echo "✅ SUCCESS: Dashboard shortcut added to your Windows Startup folder!"
