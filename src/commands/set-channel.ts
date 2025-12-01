import {
  ChannelType,
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextChannel,
} from "discord.js";
import type { Command } from "../types";
import { getT } from "../utils/i18n";
import { logger } from "../utils/logger";
import { postOrUpdateInChannel } from "../utils/messageManager";
import { getServerConfigs, setServerConfig } from "../utils/serverConfig";

const SetChannelCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("set-channel")
    .setNameLocalizations({
      "es-ES": "establecer-canal",
    })
    .setDescription("Sets the channel for map rotation updates.")
    .setDescriptionLocalizations({
      "es-ES": "Establece el canal para las actualizaciones de rotación de mapas.",
    })
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setNameLocalizations({
          "es-ES": "canal",
        })
        .setDescription("The channel to send updates to")
        .setDescriptionLocalizations({
          "es-ES": "El canal para enviar actualizaciones",
        })
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as Command["data"],
  async execute(interaction: ChatInputCommandInteraction) {
    // Get Server Config for locale
    const configs = await getServerConfigs();
    const config = interaction.guildId ? configs[interaction.guildId] : null;
    const locale = config?.locale || interaction.guild?.preferredLocale || "en";
    const t = getT(locale);

    if (!interaction.guildId) {
      await interaction.reply({
        content: t("common.only_in_guild"),
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
      content: t("commands.set_channel.success", { channel: `#${channel.name}` }),
    });

    // Trigger map status update in the background (don't await)
    postOrUpdateInChannel(interaction.client, interaction.guildId, channel.id).catch((error) => {
      logger.error({ err: error }, `Failed to post initial update to ${channel.id}`);
    });
  },
};

module.exports = SetChannelCommand;
