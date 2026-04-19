const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche la liste des commandes disponibles')
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setTitle('+ Voici la liste des commandes disponibles :')
      .setDescription(
        `**Gen**\n` +
        `\`lettres-gen\` | \`nitro-gen\` | \`nitropromo-gen\` | \`nombres-gen\` | \`token-gen\`\n\n` +

        `**Help**\n` +
        `\`help\`\n\n` +

        `**Infos**\n` +
        `\`hack\`\n\n` +

        `**Utiles**\n` +
        `\`avatar\` | \`banner\` | \`bio\` | \`calcul\` | \`decode\` | \`encode\` | \`botlink\` | \`ping\` | \`profile\` | \`say\`\n\n` +

        `**Webhooks**\n` +
        `\`webhook-info\`\n\n` +

        `**Nsfw**\n` +
        `\`nsfw\``
      )
      .setFooter({ 
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
      })
      .setTimestamp();

    // Boutons en bas
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Support')
        .setURL('https://discord.gg/nrWtpbdgYv')         
        .setStyle(ButtonStyle.Link)
        .setEmoji('🔗'),

      new ButtonBuilder()
        .setLabel('Lien du bot')
        .setURL(`https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}`)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🔗')
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  },
};