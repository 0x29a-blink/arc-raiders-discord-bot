import { Client } from 'discord.js';
import { Event } from '../types';
import { updateMapStatus } from '../utils/mapScheduler';
import { logger } from '../utils/logger';

const event: Event = {
  name: 'ready',
  once: true,

  async execute(client: Client) {
    logger.info(`Bot is ready! Logged in as ${client.user?.tag}`);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);

    // Update map status immediately on startup
    logger.info('Updating map rotation status...');
    await updateMapStatus(client);
  },
};

module.exports = event;
