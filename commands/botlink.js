const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botlink')
    .setDescription("Génère les liens d'installation du bot (serveurs + utilisateurs)")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur pour qui générer les liens (optionnel)")
        .setRequired(false)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;

    const clientId = process.env.CLIENT_ID;

    if (!clientId) {
      return interaction.reply({
        content: "❌ Erreur : `CLIENT_ID` non trouvé dans le `.env`",
        ephemeral: true
      });
    }

    const serverInstallLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&permissions=0`;

    const userInstallLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=applications.commands&integration_type=1`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setTitle(`= Liens d'invitation pour ${target.username}#${target.discriminator || '0000'}`)
      .setDescription(`(${target.id})`)
      .setFooter({ 
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Installation serveurs')
        .setURL(serverInstallLink)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🔗'),

      new ButtonBuilder()
        .setLabel('Installation utilisateurs')
        .setURL(userInstallLink)
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