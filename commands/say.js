const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Dire un message')
    .addBooleanOption(option =>
      option.setName('embed')
        .setDescription('Envoyer le message dans un embed ?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Le message à répéter')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('Nombre de fois où le message sera envoyé (par défaut : 1)')
        .setMinValue(1)
        .setMaxValue(10)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const useEmbed = interaction.options.getBoolean('embed');
    const message = interaction.options.getString('message');
    const count = interaction.options.getInteger('count') || 1;

    // Utilise deferReply pour éviter les timeouts si l'envoi prend du temps
    await interaction.deferReply({ ephemeral: true });

    for (let i = 0; i < count; i++) {
      if (useEmbed) {
        const embed = new EmbedBuilder()
          .setColor(0x23272A)
          .setDescription(message);

        await interaction.followUp({ embeds: [embed], ephemeral: false });
      } else {
        await interaction.followUp({ content: message, ephemeral: false });
      }
    }

    // Confirme l'envoi
    await interaction.editReply({
      content: `${count} message${count > 1 ? 's' : ''} ${count > 1 ? 'ont été' : 'a été'} envoyé${count > 1 ? 's' : ''}.`,
    });
  },
};