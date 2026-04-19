const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence du bot')
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const sent = await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    const asciiLines = [
      `= Ping du bot`,
      `→ ${latency} ms`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`fix\n${asciiLines}\n\`\`\``)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.editReply({ embeds: [embed] });
  },
};