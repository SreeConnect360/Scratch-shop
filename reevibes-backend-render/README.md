# ReeVibes Backend (Standalone Render Deployment via Docker)

This folder contains a copy of the ReeVibes Spring Boot backend service, prepared for standalone deployment on **Render** using Docker.

## Render Deployment Settings

Configure the following settings in your Render dashboard when creating a new **Web Service**:

1. **Runtime / Language**: Select `Docker` from the dropdown list.
2. **Branch**: `main` (or whichever branch you push to)
3. **Region**: Choose the region closest to you.

Render will automatically read the `Dockerfile` inside this directory to build and run your Spring Boot application on port `8081`.

## Environment Variables to Add in Render

Add the following environment variables in your Render Web Service settings (**Environment** tab):

| Key | Value / Description |
|---|---|
| `DB_URL` | `jdbc:postgresql://aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0` |
| `DB_USERNAME` | `postgres.rofhcjedmviwzysipmav` |
| `DB_PASSWORD` | `SreeSri@2007` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `none` |
| `GMAIL_CLIENT_ID` | Your Google OAuth Client ID |
| `GMAIL_CLIENT_SECRET` | Your Google OAuth Client Secret |
| `GMAIL_REFRESH_TOKEN` | Your Google OAuth Refresh Token |
