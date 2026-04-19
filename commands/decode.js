const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decode')
    .setDescription('Décode un texte en Base64')
    .addStringOption(option =>
      option.setName('texte')
        .setDescription('Le texte Base64 à décoder')
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const texte = interaction.options.getString('texte');

    let decoded;
    try {
      decoded = Buffer.from(texte, 'base64').toString('utf-8');
      
      if (Buffer.from(decoded, 'utf-8').toString('base64').replace(/=+$/, '') !== texte.replace(/=+$/, '')) {
        throw new Error('Non valide');
      }
    } catch {
      return interaction.reply({
        content: `\`\`\`diff\n- Le texte fourni n'est pas un Base64 valide.\n\`\`\``,
        ephemeral: false,
      });
    }

    const asciiLines = [
      `- Text encodé (Base64)🔒`,
      `${texte}`,
      ``,
      `+ Text Décodé`,
      `${decoded}`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`diff\n${asciiLines}\n\`\`\``)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};