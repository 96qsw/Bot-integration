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

    // Vérifie si l'interaction provient d'un salon textuel
    if (!interaction.channel) {
      return interaction.reply({ content: 'Cette commande ne peut être utilisée que dans un salon textuel.', flags: MessageFlags.Ephemeral });
    }

    for (let i = 0; i < count; i++) {
      if (useEmbed) {
        const embed = new EmbedBuilder()
          .setColor(0x23272A)
          .setDescription(message);

        await interaction.channel.send({ embeds: [embed] });
      } else {
        await interaction.channel.send(message);
      }
    }

    // Répond à l'interaction pour confirmer l'envoi
    if (count === 1) {
      await interaction.reply({ content: 'Message envoyé.', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: `${count} messages envoyés.`, flags: MessageFlags.Ephemeral });
    }
  },
};