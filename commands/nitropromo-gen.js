const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nitropromo-gen')
    .setDescription('Génère un lien promo Nitro Discord')
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 16;
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const promoURL = `https://discordapp.com/promotions/${code}`;

    const asciiText = `Voici un lien promo Nitro généré :`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`\n${asciiText}\n\`\`\`\n${promoURL}`)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Lien Promo')
        .setURL(promoURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🎁')
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  },
};