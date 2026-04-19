const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
    .setContexts(0, 1, 2)        
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const useEmbed = interaction.options.getBoolean('embed');
    const message = interaction.options.getString('message');

    if (useEmbed) {
      
      const embed = new EmbedBuilder()
        .setColor(0x23272A)       
        .setDescription(message)
      

      await interaction.reply({ embeds: [embed] });
    } else {
      // Message en texte normal
      await interaction.reply(message);
    }
  },
};