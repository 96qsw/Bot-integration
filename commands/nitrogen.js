const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nitro-gen')
    .setDescription('Génère un code Discord Nitro aléatoire.')
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const code = Math.random().toString(36).substring(2, 18).toUpperCase();
    const nitroLink = `https://discord.gift/${code}`;

   
    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)                    
      .setTitle("`Voici un code Nitro généré :`")
      .setDescription(nitroLink)
      .setTimestamp();

    
    const button = new ButtonBuilder()
      .setLabel('Lien Nitro')
      .setURL(nitroLink)
      .setStyle(ButtonStyle.Link)
      .setEmoji('🔗');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};