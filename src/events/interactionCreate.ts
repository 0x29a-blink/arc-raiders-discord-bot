import { Interaction, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import { logger } from '../utils/logger';
import { getCurrentRotation, getNextRotationTimestamp, formatCondition, formatLocationEvents, CONDITION_EMOJIS, CONDITION_COLORS, MAP_ROTATIONS } from '../config/mapRotation';
import { generateMapImage } from '../utils/imageGenerator';
import { interactionLockManager } from '../utils/interactionLock';

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isButton()) return;

  try {
    await interaction.deferUpdate();

    const customId = interaction.customId;
    const messageId = interaction.message.id;
    const userId = interaction.user.id;

    // Check lock status
    if (!interactionLockManager.canInteract(messageId, userId)) {
        const remaining = interactionLockManager.getRemainingTime(messageId);
        await interaction.followUp({
            content: `🚫 This menu is currently being used by another user. Please wait ${remaining} seconds.`,
            ephemeral: true
        });
        return;
    }

    // Acquire or refresh lock automatically
    interactionLockManager.acquireLock(messageId, userId, interaction.channelId!, interaction.guildId!);
    const current = getCurrentRotation();
    const nextTimestamp = getNextRotationTimestamp();
    
    let embed = new EmbedBuilder()
      .setTitle('Arc Raiders - Map Rotation Status')
      .setColor(CONDITION_COLORS[current.damMajor] || 0x5865f2)
      .setTimestamp()
      .setFooter({ text: 'Arc Raiders Bot • Updates every hour' });

    let description = `**Current Conditions**\nNext rotation: <t:${nextTimestamp}:R>`;

    const getButtons = (mode: 'map' | 'major' | 'minor') => {
      let row1: ActionRowBuilder<ButtonBuilder>;
      let row2: ActionRowBuilder<ButtonBuilder>;

      if (mode === 'map') {
        row1 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder().setCustomId('view_map_dam').setLabel('Dam').setStyle(ButtonStyle.Secondary).setEmoji('🏔️'),
            new ButtonBuilder().setCustomId('view_map_buriedCity').setLabel('Buried City').setStyle(ButtonStyle.Secondary).setEmoji('🏛️'),
            new ButtonBuilder().setCustomId('view_map_spaceport').setLabel('Spaceport').setStyle(ButtonStyle.Secondary).setEmoji('🚀'),
            new ButtonBuilder().setCustomId('view_map_blueGate').setLabel('Blue Gate').setStyle(ButtonStyle.Secondary).setEmoji('🌉'),
            new ButtonBuilder().setCustomId('view_map_stellaMontis').setLabel('Stella Montis').setStyle(ButtonStyle.Secondary).setEmoji('🏔️')
          );
        row2 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder().setCustomId('view_mode_major').setLabel('Show Major Events').setStyle(ButtonStyle.Primary).setEmoji('⚔️'),
            new ButtonBuilder().setCustomId('view_mode_minor').setLabel('Show Minor Events').setStyle(ButtonStyle.Primary).setEmoji('🔍'),
            new ButtonBuilder().setCustomId('view_overview').setLabel('Home').setStyle(ButtonStyle.Secondary).setEmoji('🏠').setDisabled(true)
          );
      } else if (mode === 'major') {
        row1 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder().setCustomId('view_event_Harvester').setLabel('Harvester').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Harvester']),
            new ButtonBuilder().setCustomId('view_event_Night').setLabel('Night').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Night']),
            new ButtonBuilder().setCustomId('view_event_Storm').setLabel('Storm').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Storm']),
            new ButtonBuilder().setCustomId('view_event_Tower').setLabel('Tower').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Tower']),
            new ButtonBuilder().setCustomId('view_event_Bunker').setLabel('Bunker').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Bunker'])
          );
        row2 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder().setCustomId('view_event_Matriarch').setLabel('Matriarch').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Matriarch']),
            new ButtonBuilder().setCustomId('view_mode_map').setLabel('Show Map').setStyle(ButtonStyle.Primary).setEmoji('🗺️'),
            new ButtonBuilder().setCustomId('view_mode_minor').setLabel('Show Minor Events').setStyle(ButtonStyle.Primary).setEmoji('🔍'),
            new ButtonBuilder().setCustomId('view_overview').setLabel('Home').setStyle(ButtonStyle.Secondary).setEmoji('🏠')
          );
      } else { // minor
        row1 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder().setCustomId('view_event_Husks').setLabel('Husks').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Husks']),
            new ButtonBuilder().setCustomId('view_event_Blooms').setLabel('Blooms').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Blooms']),
            new ButtonBuilder().setCustomId('view_event_Caches').setLabel('Caches').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Caches']),
            new ButtonBuilder().setCustomId('view_event_Probes').setLabel('Probes').setStyle(ButtonStyle.Secondary).setEmoji(CONDITION_EMOJIS['Probes'])
          );
        row2 = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder().setCustomId('view_mode_map').setLabel('Show Map').setStyle(ButtonStyle.Primary).setEmoji('🗺️'),
            new ButtonBuilder().setCustomId('view_mode_major').setLabel('Show Major Events').setStyle(ButtonStyle.Primary).setEmoji('⚔️'),
            new ButtonBuilder().setCustomId('view_overview').setLabel('Home').setStyle(ButtonStyle.Secondary).setEmoji('🏠')
          );
      }
      return [row1, row2];
    };

    // handle view mode switching
    if (customId === 'view_mode_major') {
      await interaction.editReply({ components: getButtons('major') });
      return;
    }
    if (customId === 'view_mode_minor') {
      await interaction.editReply({ components: getButtons('minor') });
      return;
    }
    if (customId === 'view_mode_map') {
      await interaction.editReply({ components: getButtons('map') });
      return;
    }

    // handle home / overview
    if (customId === 'view_overview') {
      embed.setDescription(
        `**Current Conditions**\nNext rotation: <t:${nextTimestamp}:R>\n\n` +
        `**🏔️ Dam**\n${formatLocationEvents(current.damMajor, current.damMinor)}\n\n` +
        `**🏛️ Buried City**\n${formatLocationEvents(current.buriedCityMajor, current.buriedCityMinor)}\n\n` +
        `**🚀 Spaceport**\n${formatLocationEvents(current.spaceportMajor, current.spaceportMinor)}\n\n` +
        `**🌉 Blue Gate**\n${formatLocationEvents(current.blueGateMajor, current.blueGateMinor)}\n\n` +
        `**🏔️ Stella Montis**\n${formatLocationEvents(current.stellaMontisMajor, current.stellaMontisMinor)}`
      );

<<<<<<< HEAD
      const errorMessage = "There was an error while executing this command!";
=======
      let forecastText = '';
      const currentHour = current.hour;
      const nextRotationTs = getNextRotationTimestamp();
>>>>>>> cfcefdf (feat: rework map image generation and embed layout)

      for (let i = 1; i <= 6; i++) {
         const hourIndex = (currentHour + i) % 24;
         const rotation = MAP_ROTATIONS[hourIndex];
         const timestamp = nextRotationTs + (i - 1) * 3600;
         const timeLabel = `<t:${timestamp}:R>`;
         
         const events = [];
         if (rotation.damMajor !== 'None') events.push(`Dam: ${CONDITION_EMOJIS[rotation.damMajor]}`);
         if (rotation.buriedCityMajor !== 'None') events.push(`Buried: ${CONDITION_EMOJIS[rotation.buriedCityMajor]}`);
         if (rotation.spaceportMajor !== 'None') events.push(`Space: ${CONDITION_EMOJIS[rotation.spaceportMajor]}`);
         if (rotation.blueGateMajor !== 'None') events.push(`Gate: ${CONDITION_EMOJIS[rotation.blueGateMajor]}`);
         if (rotation.stellaMontisMajor !== 'None') events.push(`Stella: ${CONDITION_EMOJIS[rotation.stellaMontisMajor]}`);

         if (events.length > 0) {
           forecastText += `**${timeLabel}** • ${events.join(' | ')}\n`;
         } else {
           forecastText += `**${timeLabel}** • No Major Events\n`;
         }
       }
       
       // embed.setDescription(description); // Removed as we set it above
       embed.addFields({
         name: '━━━━━━ 🔮 FORECAST (Next 6 Hours) ━━━━━━',
         value: forecastText || 'No major events upcoming.',
         inline: false,
       });

       embed.setImage('attachment://map-status.png');

       await interaction.editReply({ embeds: [embed], components: getButtons('map') });
       return;
    }

    if (customId.startsWith('view_map_')) {
      const location = customId.replace('view_map_', '');
      const locationName = location.charAt(0).toUpperCase() + location.slice(1).replace(/([A-Z])/g, ' $1').trim();
      
      let timeCol = '';
      let eventCol = '';
      
      const currentHour = current.hour;
      const nextRotationTs = getNextRotationTimestamp();

      for (let i = 1; i <= 24; i++) {
        const hourIndex = (currentHour + i) % 24;
        const rotation = MAP_ROTATIONS[hourIndex];
        const timestamp = nextRotationTs + (i - 1) * 3600;
        const timeLabel = `<t:${timestamp}:R>`;
        
        const major = rotation[`${location}Major` as keyof typeof rotation];
        const minor = rotation[`${location}Minor` as keyof typeof rotation];
        
        if (major !== 'None' || minor !== 'None') {
           let eventText = '';
           if (major !== 'None') eventText += `${CONDITION_EMOJIS[major]} ${major} `;
           if (minor !== 'None') eventText += `${CONDITION_EMOJIS[minor]} ${minor}`;
           
           timeCol += `${timeLabel}\n`;
           eventCol += `${eventText}\n`;
        }
      }
      
      let description = `**Forecast for ${locationName}**\nNext Rotation: <t:${nextTimestamp}:R>\n\n`;
      
      if (timeCol) {
          // Split by newlines to reconstruct the description line by line
          const times = timeCol.split('\n').filter(t => t);
          const events = eventCol.split('\n').filter(e => e);
          
          for(let i=0; i<times.length; i++) {
              description += `**${times[i]}** • ${events[i]}\n`;
          }
      } else {
          description += "No events upcoming in the next 24 hours.";
      }
      
      embed.setDescription(description);
      embed.setImage('attachment://map-status.png');
      embed.setFields([]);
      
      const buttons = getButtons('map');
      (buttons[1].components[2] as ButtonBuilder).setDisabled(false);
      
      await interaction.editReply({ embeds: [embed], components: buttons });
      return;
    }

    // handle event type filter
    if (customId.startsWith('view_event_')) {
      const eventType = customId.replace('view_event_', '');
      const emoji = eventType === 'None' ? '✅' : (CONDITION_EMOJIS[eventType] || '');
      
      let timeCol = '';
      let locCol = '';
      
      const currentHour = current.hour;
      const nextRotationTs = getNextRotationTimestamp();
      const locations = ['dam', 'buriedCity', 'spaceport', 'blueGate', 'stellaMontis'];
      
      for (let i = 1; i <= 24; i++) {
        const hourIndex = (currentHour + i) % 24;
        const rotation = MAP_ROTATIONS[hourIndex];
        const timestamp = nextRotationTs + (i - 1) * 3600;
        const timeLabel = `<t:${timestamp}:R>`;
        
        const occurringLocations = [];
        for (const loc of locations) {
            if (rotation[`${loc}Major` as keyof typeof rotation] === eventType || rotation[`${loc}Minor` as keyof typeof rotation] === eventType) {
                const locName = loc.charAt(0).toUpperCase() + loc.slice(1).replace(/([A-Z])/g, ' $1').trim();
                occurringLocations.push(locName);
            }
        }
        
        if (occurringLocations.length > 0) {
            const locText = occurringLocations.join(', ');
            timeCol += `${timeLabel}\n`;
            locCol += `${locText}\n`;
        }
      }
      
      let description = `**Forecast for ${emoji} ${eventType}**\nNext Rotation: <t:${nextTimestamp}:R>\n\n`;

      if (timeCol) {
          const times = timeCol.split('\n').filter(t => t);
          const locs = locCol.split('\n').filter(l => l);
          
          for(let i=0; i<times.length; i++) {
              description += `**${times[i]}** • ${locs[i]}\n`;
          }
      } else {
          description += "No events upcoming in the next 24 hours.";
      }
      
      embed.setDescription(description);
      embed.setImage('attachment://map-status.png');
      embed.setFields([]);

      const majorEvents = ['Harvester', 'Night', 'Storm', 'Tower', 'Bunker', 'Matriarch'];
      const mode = majorEvents.includes(eventType) ? 'major' : 'minor';
      
      const buttons = getButtons(mode);
      (buttons[1].components[3] || buttons[1].components[2] as ButtonBuilder).setDisabled(false);

      await interaction.editReply({ embeds: [embed], components: buttons });
      return;
    }

    logger.info(`Button clicked: ${customId}`);

  } catch (error) {
    logger.error({ err: error }, 'Error handling interaction');
  }
}
