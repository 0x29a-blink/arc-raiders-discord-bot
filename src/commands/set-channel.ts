import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { setServerConfig } from '../utils/serverConfig';
import { appendServerInfo } from '../utils/googleSheets';
import { postOrUpdateInChannel } from '../utils/messageManager';
import { Command } from '../types';
import { logger } from '../utils/logger';

const SetChannelCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('set-channel')
    .setDescription('Sets the channel for map rotation updates.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send updates to')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as Command['data'],
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.options.getChannel('channel', true) as TextChannel;


    setServerConfig(interaction.guildId, channel.id);
    logger.info(`✅ set-channel configured for server: ${interaction.guild?.name} (ID: ${interaction.guildId}), channel: #${channel.name} (${channel.id})`);
    // Save server info to Google Sheets
    await appendServerInfo(
      interaction.guildId,
      channel.id,
      interaction.guild?.name || 'Unknown'
    );


    // Trigger map status update only in the newly set channel
    await postOrUpdateInChannel(interaction.client, channel.id);

    await interaction.reply({
      content: `Map rotation updates will now be sent to #${channel.name}.`,
      ephemeral: true,
    });
  },
};

module.exports = SetChannelCommand;
