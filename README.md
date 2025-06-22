# Frontend development guide

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/wonderfulrichard123gmailcoms-projects/v0-frontend-development-guide)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ztWmcOvNxib)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/wonderfulrichard123gmailcoms-projects/v0-frontend-development-guide](https://vercel.com/wonderfulrichard123gmailcoms-projects/v0-frontend-development-guide)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/ztWmcOvNxib](https://v0.dev/chat/projects/ztWmcOvNxib)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

<http://localhost:3000/api/image-matcher?name=Urfa%20lahmacun%20(hot)&desc=Very%20thin%20Turkish%20pizza%20covered%20with%20parsley,%20garlic,%20hot%20pepper%20and%20pomegranate%20molasses&gen_desc=Turkish%20pizza&category=hot%20starters&count=6&place_id=ChIJHcPKg-y5yhQREEHS-JpdxuM>

```bash
curl -X GET \
  "http://localhost:3000/api/image-matcher" \
  -G \
  --data-urlencode "name=Urfa lahmacun (hot)" \
  --data-urlencode "desc=Very thin Turkish pizza covered with parsley, garlic, hot pepper and pomegranate molasses" \
  --data-urlencode "gen_desc=Turkish pizza" \
  --data-urlencode "category=hot starters" \
  --data-urlencode "count=6" \
  --data-urlencode "place_id=ChIJHcPKg-y5yhQREEHS-JpdxuM" \
  -H "Accept: application/json"
```
