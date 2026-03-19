@echo off
set "startupPath=%REPLACE_ME_WITH_REAL_PATH%"
:: I'll use PowerShell to be safe
powershell -Command "$s=[Environment]::GetFolderPath('Startup'); $f=Join-Path $s 'NaukriAI_Dashboard.lnk'; if(Test-Path $f){Remove-Item $f -Force; echo '✅ Startup shortcut removed.'} else {echo 'ℹ️ No startup shortcut found.'}"
pause
