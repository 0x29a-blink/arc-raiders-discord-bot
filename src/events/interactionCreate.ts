import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type Interaction,
} from "discord.js";
import {
  CONDITION_COLORS,
  CONDITION_EMOJIS,
  formatLocationEvents,
  getCurrentRotation,
  getNextRotationTimestamp,
  MAP_ROTATIONS,
} from "../config/mapRotation";
import { interactionLockManager } from "../utils/interactionLock";
import { logger } from "../utils/logger";
import { getServerConfigs } from "../utils/serverConfig";

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isButton()) return;

  try {
    await interaction.deferUpdate();

    const customId = interaction.customId;
    const messageId = interaction.message.id;
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    // Check lock status
    if (!interactionLockManager.canInteract(messageId, userId)) {
      const remaining = interactionLockManager.getRemainingTime(messageId);
      await interaction.followUp({
        content: `🚫 This menu is currently being used by another user. Please wait ${remaining} seconds.`,
        ephemeral: true,
      });
      return;
    }

    // Acquire or refresh lock automatically
    interactionLockManager.acquireLock(
      messageId,
      userId,
      interaction.channelId!,
      interaction.guildId!,
    );

    // Get Server Config for Mobile Friendly setting
    const configs = await getServerConfigs();
    const config = guildId ? configs[guildId] : null;
    const mobileFriendly = config?.mobileFriendly ?? false;

    const current = getCurrentRotation();
    const nextTimestamp = getNextRotationTimestamp();

    const embed = new EmbedBuilder()
      .setTitle("Arc Raiders - Map Rotation Status")
      .setColor(CONDITION_COLORS[current.damMajor] || 0x5865f2)
      .setTimestamp()
      .setFooter({ text: "Arc Raiders Bot • Updates every hour" });

    const getButtons = (mode: "map" | "major" | "minor") => {
      let row1: ActionRowBuilder<ButtonBuilder>;
      let row2: ActionRowBuilder<ButtonBuilder>;

      if (mode === "map") {
        row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("view_map_dam")
            .setLabel("Dam")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏔️"),
          new ButtonBuilder()
            .setCustomId("view_map_buriedCity")
            .setLabel("Buried City")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏛️"),
          new ButtonBuilder()
            .setCustomId("view_map_spaceport")
            .setLabel("Spaceport")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🚀"),
          new ButtonBuilder()
            .setCustomId("view_map_blueGate")
            .setLabel("Blue Gate")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🌉"),
          new ButtonBuilder()
            .setCustomId("view_map_stellaMontis")
            .setLabel("Stella Montis")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏔️"),
        );
        row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("view_mode_major")
            .setLabel("Show Major Events")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⚔️"),
          new ButtonBuilder()
            .setCustomId("view_mode_minor")
            .setLabel("Show Minor Events")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔍"),
          new ButtonBuilder()
            .setCustomId("view_overview")
            .setLabel("Home")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏠")
            .setDisabled(true),
        );
      } else if (mode === "major") {
        row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("view_event_Harvester")
            .setLabel("Harvester")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Harvester),
          new ButtonBuilder()
            .setCustomId("view_event_Night")
            .setLabel("Night")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Night),
          new ButtonBuilder()
            .setCustomId("view_event_Storm")
            .setLabel("Storm")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Storm),
          new ButtonBuilder()
            .setCustomId("view_event_Tower")
            .setLabel("Tower")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Tower),
          new ButtonBuilder()
            .setCustomId("view_event_Bunker")
            .setLabel("Bunker")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Bunker),
        );
        row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("view_event_Matriarch")
            .setLabel("Matriarch")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Matriarch),
          new ButtonBuilder()
            .setCustomId("view_mode_map")
            .setLabel("Show Map")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🗺️"),
          new ButtonBuilder()
            .setCustomId("view_mode_minor")
            .setLabel("Show Minor Events")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔍"),
          new ButtonBuilder()
            .setCustomId("view_overview")
            .setLabel("Home")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏠"),
        );
      } else {
        // minor
        row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("view_event_Husks")
            .setLabel("Husks")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Husks),
          new ButtonBuilder()
            .setCustomId("view_event_Blooms")
            .setLabel("Blooms")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Blooms),
          new ButtonBuilder()
            .setCustomId("view_event_Caches")
            .setLabel("Caches")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Caches),
          new ButtonBuilder()
            .setCustomId("view_event_Probes")
            .setLabel("Probes")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONDITION_EMOJIS.Probes),
        );
        row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("view_mode_map")
            .setLabel("Show Map")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🗺️"),
          new ButtonBuilder()
            .setCustomId("view_mode_major")
            .setLabel("Show Major Events")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⚔️"),
          new ButtonBuilder()
            .setCustomId("view_overview")
            .setLabel("Home")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🏠"),
        );
      }
      return [row1, row2];
    };

    // handle view mode switching
    if (customId === "view_mode_major") {
      await interaction.editReply({ components: getButtons("major") });
      return;
    }
    if (customId === "view_mode_minor") {
      await interaction.editReply({ components: getButtons("minor") });
      return;
    }
    if (customId === "view_mode_map") {
      await interaction.editReply({ components: getButtons("map") });
      return;
    }

    // handle home / overview
    if (customId === "view_overview") {
      embed.setDescription(`**Current Conditions**\nNext rotation: <t:${nextTimestamp}:R>`);

      if (mobileFriendly) {
        embed.addFields(
          {
            name: "🏔️ Dam",
            value: formatLocationEvents(current.damMajor, current.damMinor),
            inline: false,
          },
          {
            name: "🏛️ Buried City",
            value: formatLocationEvents(current.buriedCityMajor, current.buriedCityMinor),
            inline: false,
          },
          {
            name: "🚀 Spaceport",
            value: formatLocationEvents(current.spaceportMajor, current.spaceportMinor),
            inline: false,
          },
          {
            name: "🌉 Blue Gate",
            value: formatLocationEvents(current.blueGateMajor, current.blueGateMinor),
            inline: false,
          },
          {
            name: "🏔️ Stella Montis",
            value: formatLocationEvents(current.stellaMontisMajor, current.stellaMontisMinor),
            inline: false,
          },
        );
      } else {
        embed.addFields(
          {
            name: "🏔️ Dam",
            value: formatLocationEvents(current.damMajor, current.damMinor),
            inline: true,
          },
          {
            name: "🏛️ Buried City",
            value: formatLocationEvents(current.buriedCityMajor, current.buriedCityMinor),
            inline: true,
          },
          {
            name: "🚀 Spaceport",
            value: formatLocationEvents(current.spaceportMajor, current.spaceportMinor),
            inline: true,
          },
          {
            name: "🌉 Blue Gate",
            value: formatLocationEvents(current.blueGateMajor, current.blueGateMinor),
            inline: true,
          },
          { name: "\u200b", value: "\u200b", inline: true },
          {
            name: "🏔️ Stella Montis",
            value: formatLocationEvents(current.stellaMontisMajor, current.stellaMontisMinor),
            inline: true,
          },
        );
      }

      const currentHour = current.hour;
      const nextRotationTs = getNextRotationTimestamp();

      if (mobileFriendly) {
        let forecastText = "";
        for (let i = 1; i <= 6; i++) {
          const hourIndex = (currentHour + i) % 24;
          const rotation = MAP_ROTATIONS[hourIndex];
          const timestamp = nextRotationTs + (i - 1) * 3600;
          const timeLabel = `<t:${timestamp}:R>`;

          const events = [];
          if (rotation.damMajor !== "None")
            events.push(`Dam: ${CONDITION_EMOJIS[rotation.damMajor]}`);
          if (rotation.buriedCityMajor !== "None")
            events.push(`Buried: ${CONDITION_EMOJIS[rotation.buriedCityMajor]}`);
          if (rotation.spaceportMajor !== "None")
            events.push(`Space: ${CONDITION_EMOJIS[rotation.spaceportMajor]}`);
          if (rotation.blueGateMajor !== "None")
            events.push(`Gate: ${CONDITION_EMOJIS[rotation.blueGateMajor]}`);
          if (rotation.stellaMontisMajor !== "None")
            events.push(`Stella: ${CONDITION_EMOJIS[rotation.stellaMontisMajor]}`);

          if (events.length > 0) {
            forecastText += `**${timeLabel}** • ${events.join(" | ")}\n`;
          } else {
            forecastText += `**${timeLabel}** • No Major Events\n`;
          }
        }

        embed.addFields({
          name: "━━━━━━ 🔮 FORECAST (Next 6 Hours) ━━━━━━",
          value: forecastText || "No major events upcoming.",
          inline: false,
        });
      } else {
        embed.addFields({
          name: "━━━━━━ 🔮 FORECAST (Next 6 Hours) ━━━━━━",
          value: "\u200b",
          inline: false,
        });

        let timeCol = "";
        let conditionCol = "";

        for (let i = 1; i <= 6; i++) {
          const hourIndex = (currentHour + i) % 24;
          const rotation = MAP_ROTATIONS[hourIndex];
          const timestamp = nextRotationTs + (i - 1) * 3600;
          const timeLabel = `<t:${timestamp}:R>`;

          const events = [];
          if (rotation.damMajor !== "None")
            events.push(`Dam: ${CONDITION_EMOJIS[rotation.damMajor]}`);
          if (rotation.buriedCityMajor !== "None")
            events.push(`Buried: ${CONDITION_EMOJIS[rotation.buriedCityMajor]}`);
          if (rotation.spaceportMajor !== "None")
            events.push(`Space: ${CONDITION_EMOJIS[rotation.spaceportMajor]}`);
          if (rotation.blueGateMajor !== "None")
            events.push(`Gate: ${CONDITION_EMOJIS[rotation.blueGateMajor]}`);
          if (rotation.stellaMontisMajor !== "None")
            events.push(`Stella: ${CONDITION_EMOJIS[rotation.stellaMontisMajor]}`);

          const eventText = events.length > 0 ? events.join(" | ") : "No Major Events";

          timeCol += `${timeLabel}\n`;
          conditionCol += `${eventText}\n`;
        }

        embed.addFields(
          { name: "Time Until", value: timeCol, inline: true },
          { name: "Conditions", value: conditionCol, inline: true },
          { name: "\u200b", value: "\u200b", inline: true },
        );
      }

      embed.setImage("attachment://map-status.png");

      await interaction.editReply({
        embeds: [embed],
        components: getButtons("map"),
      });
      return;
    }

    if (customId.startsWith("view_map_")) {
      const location = customId.replace("view_map_", "");
      const locationName =
        location.charAt(0).toUpperCase() +
        location
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim();

      const currentHour = current.hour;
      const nextRotationTs = getNextRotationTimestamp();

      embed.setDescription(
        `**Forecast for ${locationName}**\nNext Rotation: <t:${nextTimestamp}:R>`,
      );
      embed.setImage("attachment://map-status.png");
      embed.setFields([]);

      if (mobileFriendly) {
        let description = `**Forecast for ${locationName}**\nNext Rotation: <t:${nextTimestamp}:R>\n\n`;
        let hasEvents = false;

        for (let i = 1; i <= 24; i++) {
          const hourIndex = (currentHour + i) % 24;
          const rotation = MAP_ROTATIONS[hourIndex];
          const timestamp = nextRotationTs + (i - 1) * 3600;
          const timeLabel = `<t:${timestamp}:R>`;

          const major = rotation[`${location}Major` as keyof typeof rotation];
          const minor = rotation[`${location}Minor` as keyof typeof rotation];

          if (major !== "None" || minor !== "None") {
            let eventText = "";
            if (major !== "None") eventText += `${CONDITION_EMOJIS[major]} ${major} `;
            if (minor !== "None") eventText += `${CONDITION_EMOJIS[minor]} ${minor}`;

            description += `**${timeLabel}** • ${eventText}\n`;
            hasEvents = true;
          }
        }

        if (!hasEvents) description += "No events upcoming in the next 24 hours.";
        embed.setDescription(description);
      } else {
        // Desktop: Inline Fields
        let hasEvents = false;
        let timeCol = "";
        let conditionCol = "";

        for (let i = 1; i <= 24; i++) {
          const hourIndex = (currentHour + i) % 24;
          const rotation = MAP_ROTATIONS[hourIndex];
          const timestamp = nextRotationTs + (i - 1) * 3600;
          const timeLabel = `<t:${timestamp}:R>`;

          const major = rotation[`${location}Major` as keyof typeof rotation];
          const minor = rotation[`${location}Minor` as keyof typeof rotation];

          if (major !== "None" || minor !== "None") {
            let eventText = "";
            if (major !== "None") eventText += `${CONDITION_EMOJIS[major]} ${major} `;
            if (minor !== "None") eventText += `${CONDITION_EMOJIS[minor]} ${minor}`;

            timeCol += `${timeLabel}\n`;
            conditionCol += `${eventText}\n`;
            hasEvents = true;
          }
        }

        if (hasEvents) {
          embed.addFields(
            { name: "Time Until", value: timeCol, inline: true },
            { name: "Conditions", value: conditionCol, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
          );
        } else {
          embed.setDescription(
            `${embed.data.description}\n\nNo events upcoming in the next 24 hours.`,
          );
        }
      }

      const buttons = getButtons("map");
      (buttons[1].components[2] as ButtonBuilder).setDisabled(false);

      await interaction.editReply({ embeds: [embed], components: buttons });
      return;
    }

    // handle event type filter
    if (customId.startsWith("view_event_")) {
      const eventType = customId.replace("view_event_", "");
      const emoji = eventType === "None" ? "✅" : CONDITION_EMOJIS[eventType] || "";

      const currentHour = current.hour;
      const nextRotationTs = getNextRotationTimestamp();
      const locations = ["dam", "buriedCity", "spaceport", "blueGate", "stellaMontis"];

      embed.setDescription(
        `**Forecast for ${emoji} ${eventType}**\nNext Rotation: <t:${nextTimestamp}:R>`,
      );
      embed.setImage("attachment://map-status.png");
      embed.setFields([]);

      if (mobileFriendly) {
        let description = `**Forecast for ${emoji} ${eventType}**\nNext Rotation: <t:${nextTimestamp}:R>\n\n`;
        let hasEvents = false;

        for (let i = 1; i <= 24; i++) {
          const hourIndex = (currentHour + i) % 24;
          const rotation = MAP_ROTATIONS[hourIndex];
          const timestamp = nextRotationTs + (i - 1) * 3600;
          const timeLabel = `<t:${timestamp}:R>`;

          const occurringLocations = [];
          for (const loc of locations) {
            if (
              rotation[`${loc}Major` as keyof typeof rotation] === eventType ||
              rotation[`${loc}Minor` as keyof typeof rotation] === eventType
            ) {
              const locName =
                loc.charAt(0).toUpperCase() +
                loc
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim();
              occurringLocations.push(locName);
            }
          }

          if (occurringLocations.length > 0) {
            const locText = occurringLocations.join(", ");
            description += `**${timeLabel}** • ${locText}\n`;
            hasEvents = true;
          }
        }

        if (!hasEvents) description += "No events upcoming in the next 24 hours.";
        embed.setDescription(description);
      } else {
        // Desktop: Inline Fields
        let hasEvents = false;
        let timeCol = "";
        let locCol = "";

        for (let i = 1; i <= 24; i++) {
          const hourIndex = (currentHour + i) % 24;
          const rotation = MAP_ROTATIONS[hourIndex];
          const timestamp = nextRotationTs + (i - 1) * 3600;
          const timeLabel = `<t:${timestamp}:R>`;

          const occurringLocations = [];
          for (const loc of locations) {
            if (
              rotation[`${loc}Major` as keyof typeof rotation] === eventType ||
              rotation[`${loc}Minor` as keyof typeof rotation] === eventType
            ) {
              const locName =
                loc.charAt(0).toUpperCase() +
                loc
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim();
              occurringLocations.push(locName);
            }
          }

          if (occurringLocations.length > 0) {
            const locText = occurringLocations.join(", ");
            timeCol += `${timeLabel}\n`;
            locCol += `${locText}\n`;
            hasEvents = true;
          }
        }

        if (hasEvents) {
          embed.addFields(
            { name: "Time Until", value: timeCol, inline: true },
            { name: "Locations", value: locCol, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
          );
        } else {
          embed.setDescription(
            `${embed.data.description}\n\nNo events upcoming in the next 24 hours.`,
          );
        }
      }

      const majorEvents = ["Harvester", "Night", "Storm", "Tower", "Bunker", "Matriarch"];
      const mode = majorEvents.includes(eventType) ? "major" : "minor";

      const buttons = getButtons(mode);
      (buttons[1].components[3] || (buttons[1].components[2] as ButtonBuilder)).setDisabled(false);

      await interaction.editReply({ embeds: [embed], components: buttons });
      return;
    }

    logger.info(`Button clicked: ${customId}`);
  } catch (error) {
    logger.error({ err: error }, "Error handling interaction");
  }
}
