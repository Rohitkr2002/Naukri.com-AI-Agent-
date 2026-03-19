Set oWS = WScript.CreateObject("WScript.Shell")
strDesktop = oWS.SpecialFolders("Desktop")
strShortcutPath = strDesktop & "\Naukri AI Dashboard.lnk"
Set oLink = oWS.CreateShortcut(strShortcutPath)
oLink.TargetPath = "c:\Users\rajpu\Desktop\Nukari.com\LAUNCH_DASHBOARD.bat"
oLink.WorkingDirectory = "c:\Users\rajpu\Desktop\Nukari.com"
oLink.IconLocation = "shell32.dll, 43" ' Use a nice folder/computer icon
oLink.Save
WScript.Echo "✅ SUCCESS: 'Naukri AI Dashboard' shortcut created on your Desktop!"
