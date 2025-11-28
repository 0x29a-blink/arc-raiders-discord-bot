# Arc Raiders Discord Bot

A Discord bot that tracks and displays Arc Raiders map rotation conditions across all four maps (Dam, Buried City, Spaceport, and Blue Gate) with automatic hourly updates.

## Features

- 🗺️ **Automatic Map Rotation Tracking**: Updates every hour with current and next map conditions
- 📌 **Pinned Status Message**: Creates and maintains a pinned message with rich embed formatting
- 🕐 **UTC Schedule**: Follows the official Arc Raiders 24-hour UTC rotation schedule
- 🎨 **Visual Indicators**: Each condition type has unique emojis and colors
- ⚡ **Slash Commands**: Modern Discord interaction with `/ping` command for testing
- 💾 **Persistent State**: Remembers message IDs across bot restarts

## Map Conditions

The bot tracks these condition types across all maps:

- 🤖 Harvester
- 🌙 Night
- 💀 Husks
- 🌸 Blooms
- ⛈️ Storm
- 📦 Caches
- 🛸 Probes
- 🗼 Tower
- 🏰 Bunker
- ✅ None

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Discord Bot Token from [Discord Developer Portal](https://discord.com/developers/applications)
- Supabase project URL and Service Role key (used for persisting server/message metadata)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd arc-raiders-discord-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   copy .env.example .env
   ```

   Edit `.env` and fill in your values:

   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Discord Bot Setup

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token (this is your `DISCORD_TOKEN`)
5. Enable these Privileged Gateway Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### 2. Bot Permissions

The bot requires these permissions (permission integer: **274877925376**):

- ✅ Send Messages
- ✅ Embed Links
- ✅ Manage Messages (for pinning)
- ✅ Read Message History

### 3. Invite the Bot

1. Go to OAuth2 > URL Generator in the Developer Portal
2. Select scopes: `bot` and `applications.commands`
3. Select the permissions listed above
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### 4. Client ID

- **Client ID**: Found in the "General Information" section of your application.

## Usage

### Development Mode

Run the bot with hot reloading using ts-node:

```bash
npm run dev
```

### Deploy Slash Commands

Before first run or after adding new commands, deploy them:

```bash
npm run deploy-commands
```

This registers commands globally, which can take up to an hour to propagate to all servers.

### Production Mode

1. Build the TypeScript code:

   ```bash
   npm run build
   ```

2. Start the bot:
   ```bash
   npm start
   ```

## Commands

- `/ping` - Check bot latency and responsiveness.
- `/set-channel` - (Admin-only) Sets the channel where map rotation updates are posted.

## Project Structure

```
arc-raiders-discord-bot/
├── src/
│   ├── commands/           # Slash command definitions
│   │   └── ping.ts
│   ├── events/             # Discord event handlers
│   │   ├── ready.ts
│   │   └── interactionCreate.ts
│   ├── utils/              # Utility functions
│   │   ├── messageManager.ts
│   │   └── mapScheduler.ts
│   ├── config/             # Configuration files
│   │   └── mapRotation.ts  # 24-hour map schedule
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── index.ts            # Main entry point
│   └── deploy-commands.ts  # Command registration script
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Data Storage

All persistent state is stored in Supabase:

- `servers` table – columns `guild_id` (primary key), `channel_id`, `server_name`, `message_id`, `last_updated`, plus timestamps if desired. `message_id` and `last_updated` let the bot reuse pinned messages instead of spamming new ones.

You can back up or inspect this table directly in the Supabase dashboard. Deleting rows is safe; the bot will recreate them as needed.

## Supabase Setup

1. Create the required table (run once in the Supabase SQL editor):

   ```sql
   create table if not exists public.servers (
     guild_id text primary key,
     channel_id text not null,
     server_name text,
     message_id text,
     last_updated text,
     created_at timestamptz default timezone('utc', now()),
     updated_at timestamptz default timezone('utc', now())
   );
   ```

2. (Optional) Enable Row Level Security and add permissive policies if you plan to use the anon key. The bot uses the `SUPABASE_SERVICE_ROLE_KEY`, so it can bypass policies by default.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your `.env`, matching the values in the Supabase dashboard.

## How It Works

1. **Startup**: Bot logs in and immediately posts/updates the map rotation status
2. **Scheduling**: A cron job runs at the top of every hour (UTC)
3. **Updates**: The bot fetches current and next rotation from the 24-hour schedule
4. **Message Management**:
   - Reads the stored `message_id` for each channel from Supabase
   - Edits the existing pinned message or creates/pins a new one when needed
   - Writes the latest `message_id`/`last_updated` back to Supabase
5. **Persistence**: Because configuration and message metadata live in Supabase, the bot resumes seamlessly after restarts

## Troubleshooting

### Bot doesn't respond to commands

- Make sure you ran `npm run deploy-commands`.
- Check that the bot has proper permissions in the server.
- Global commands can take up to an hour to update after being deployed.

### Map rotation message not appearing

- Use the `/set-channel` command to designate a channel for updates.
- Check the bot has "Send Messages", "Embed Links", and "Manage Messages" permissions in the designated channel.
- Look at the bot's console logs for any error messages.

### TypeScript errors

- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18.x or higher

### Bot crashes on startup

- Verify all required environment variables are set in `.env`
- Check that the Discord token is valid
- Ensure the bot is invited to the server

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
