# The News App

### Features

- JWT based Authentication
- Schedule for News Refresh every 30 mins
- Used [newsData.io api](https://newsData.io)
- Category Favorites
- Blocking Categories to Avoid News
- Location based Local news ( location using [ip-api.com](ip-api.com))
- Top 10 Aricles Stored in local sotrage to be read anytime

Database Dump at : ./server/database_dump.sql

### Run Application

```sh
# server
cd ./server && npm run dev
# client
npm run dev
```
