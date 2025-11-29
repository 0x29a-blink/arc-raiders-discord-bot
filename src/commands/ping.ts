import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong! and shows bot latency"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong!\n📡 Latency: ${latency}ms\n💓 API Latency: ${apiLatency}ms`,
    );
  },
};

module.exports = command;
