import {
  ChannelType,
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextChannel,
} from "discord.js";
import type { Command } from "../types";
import { logger } from "../utils/logger";
import { postOrUpdateInChannel } from "../utils/messageManager";
import { setServerConfig } from "../utils/serverConfig";

const SetChannelCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("set-channel")
    .setDescription("Sets the channel for map rotation updates.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send updates to")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as Command["data"],
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    // Defer reply immediately to prevent timeout while generating image
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("channel", true) as TextChannel;

    await setServerConfig(interaction.guildId, channel.id, interaction.guild?.name || "Unknown");
    logger.info(
      `Set-channel configured for server: ${interaction.guild?.name} (ID: ${interaction.guildId}), channel: #${channel.name} (${channel.id})`,
    );

    // Reply immediately
    await interaction.editReply({
      content: `Map rotation updates will now be sent to #${channel.name}.\n\n**Note:** The default view is optimized for **Desktop**. If your users are primarily on mobile, use \`/settings mobile-friendly: True\` to switch to a mobile-optimized layout.`,
    });

    // Trigger map status update in the background (don't await)
    postOrUpdateInChannel(interaction.client, interaction.guildId, channel.id).catch((error) => {
      logger.error({ err: error }, `Failed to post initial update to ${channel.id}`);
    });
  },
};

module.exports = SetChannelCommand;
