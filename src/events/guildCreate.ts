import type { Client, Guild } from "discord.js";
import { logger } from "../utils/logger";

module.exports = {
  name: "guildCreate",
  async execute(guild: Guild, _client: Client) {
    logger.info(`Bot added to server: ${guild.name} (ID: ${guild.id})`);
  },
};
