# Spider Service

## Contents

- [Setup](#setup)
  - [Building](#building)
  - [Running](#running)
- [Overview](#overview)
- [What else can be done?](#what-else-can-be-done?)

## Setup

Project contains both back-end server (folder `server`) and front-end application (folder `app`). There are several scripts available from root to run, while each part can be run separately.

### Building

Project is using __npm__ as package manager and has been built with Node v12.x. Back end part requires _.env_ file  with `DB_URL` key for DB feature. To install all required packages, run from root:

```bash
npm run start:clean
```

This will install all dependencies required, build front end app and run back end server. Then open your browser and go to `http://localhost:8080`

### Running
All is done in previous step! In case you need to, you can run front-end app in development mode:

```bash
npm run start:app:dev
```

Development mode for back-end server:

```bash
npm run start:server:dev
```

## Overview

Current solution provides scanning pages for links. User provided starting URL. Optional user can provide maximum depth, maximum quantity of pages to scan and options to avoid links to the scanning page itself. Front end app is using WS connection to send requests, get real-time progress updates and receive results. Back end server additionally stores requests and pages to the DB. After scan the request info is updated with elapsed time and quantity of pages found.

## What else can be done?

The project is build to be easily extendable with more actions, additional functions, extra data operations.

Search wise, it's easy to implement search for key words, any quantity of search options (search only in URL, within body, meta, fuzzy-find, search till first found & etc), any quantity of results delivery - via WS, email, message, Telegram bot, PDF generation with download or link sent via above mentioned means. Permanent or expiring link to the results can be provided as well for sharing purposes. In it's current setup, server allows to provide any additional domains (section of activity) - work with previous DB results (user registration implementation will be required), submit document to implement search in them (additional APIs will likely be required). Subscription to changes of the results can be implemented as additional domain.

With additional time main focus would be on testing to ensure the solidity of the current base. Next - additional operations to the DB (auto-cleanup, avoidance of duplicates via update of existing), then search-specific functionality - stop/pause/restart search from the front, search for words/phrase, parts of.