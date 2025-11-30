import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} from 'discord.js';
import { setMobileFriendly, getServerConfigs } from '../utils/serverConfig';
import { postOrUpdateInChannel } from '../utils/messageManager';
import { Command } from '../types';
import { logger } from '../utils/logger';

const SettingsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Configure bot settings for this server.')
    .addBooleanOption((option) =>
      option
        .setName('mobile-friendly')
        .setDescription('Enable mobile-friendly view for map updates (default: false)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as Command['data'],
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
      return;
    }

    const mobileFriendly = interaction.options.getBoolean('mobile-friendly', true);

    await interaction.deferReply({ ephemeral: true });

    try {
      await setMobileFriendly(interaction.guildId, mobileFriendly);
      
      const configs = await getServerConfigs();
      const config = configs[interaction.guildId];
      
      if (config && config.channelId) {
          // Trigger update to reflect changes
          postOrUpdateInChannel(interaction.client, interaction.guildId, config.channelId, config.messageId).catch(err => {
              logger.error({ err }, 'Failed to update message after settings change');
          });
      }

      await interaction.editReply({
        content: `Settings updated! Mobile-friendly mode is now **${mobileFriendly ? 'ENABLED' : 'DISABLED'}**.\nThe map message will be updated shortly.`,
      });
      
      logger.info(`Settings updated for guild ${interaction.guildId}: mobileFriendly=${mobileFriendly}`);

    } catch (error) {
      logger.error({ err: error }, 'Error executing settings command');
      await interaction.editReply({
        content: 'An error occurred while saving your settings. Please try again later.',
      });
    }
  },
};

module.exports = SettingsCommand;
