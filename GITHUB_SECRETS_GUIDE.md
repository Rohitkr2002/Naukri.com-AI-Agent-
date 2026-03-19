# 🔐 GitHub Secrets Setup Guide

To ensure your **Naukri Job AI Agent** runs automatically on GitHub every day, you need to add your credentials as **Repository Secrets**.

## Steps to Add Secrets:
1. Go to your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** for each variable below.

| Secret Name | Description |
| :--- | :--- |
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_PASS` | Your 16-character Gmail App Password |
| `RECIPIENT_EMAIL` | Email where you want to receive alerts |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `RAPIDAPI_KEY` | Your RapidAPI Key (for JSearch) |
| `TWILIO_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_PHONE` | Your Twilio WhatsApp Sandbox Number |
| `USER_PHONE` | Your WhatsApp Number (e.g., `whatsapp:+91...`) |

---

> [!TIP]
> **Why use Secrets?** 
> Hardcoding these keys in your code is dangerous. GitHub Secrets keeps them encrypted and safe, allowing the code to access them only during the automated run.
