const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('encode')
    .setDescription('Encode un texte en Base64')
    .addStringOption(option =>
      option.setName('texte')
        .setDescription('Le texte à encoder en Base64')
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const texte = interaction.options.getString('texte');

    const encoded = Buffer.from(texte, 'utf-8').toString('base64');

    const asciiLines = [
      `- Texte original`,
      `${texte}`,
      ``,
      `+ Encodé (Base64)`,
      `${encoded}`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`diff\n${asciiLines}\n\`\`\``)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};