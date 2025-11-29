import type { Guild } from "discord.js";
import type { Event } from "../types";
import { logger } from "../utils/logger";
import { removeServerConfig } from "../utils/serverConfig";

const GuildDeleteEvent: Event = {
  name: "guildDelete",
  once: false,
  async execute(guild: Guild) {
    logger.info(`Bot removed from server: ${guild.name} (${guild.id})`);
    await removeServerConfig(guild.id);
    logger.info(`Removed server entry from Supabase for guildId: ${guild.id}`);
  },
};

module.exports = GuildDeleteEvent;
