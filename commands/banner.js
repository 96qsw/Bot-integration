const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription("Affiche la bannière d'un utilisateur")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux voir la bannière")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const target = interaction.options.getUser('user');

   
    const fetchedUser = await target.fetch(true).catch(() => null);

    if (!fetchedUser) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Impossible de récupérer les données de ${target.username}.\n\`\`\``,
      });
    }

    const bannerHash = fetchedUser.banner;

    if (!bannerHash) {
      return interaction.editReply({
        content: `\`\`\`diff\n- ${target.username} (ID: ${target.id}) n'a aucune bannière.\n\`\`\``,
      });
    }

    const ext = bannerHash.startsWith('a_') ? 'gif' : 'png';
    const bannerURL = `https://cdn.discordapp.com/banners/${target.id}/${bannerHash}.${ext}?size=4096`;

    const pseudo = fetchedUser.discriminator && fetchedUser.discriminator !== '0'
      ? `${fetchedUser.username}#${fetchedUser.discriminator}`
      : fetchedUser.username;

    const asciiText = `Voici la bannière de ${pseudo}.\n(${target.id}) :`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`\n${asciiText}\n\`\`\``)
      .setImage(bannerURL)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Bannière')
        .setURL(bannerURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🖼️')
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  },
};