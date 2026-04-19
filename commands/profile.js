const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Affiche le profil d'un utilisateur")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux voir le profil")
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
        content: `\`\`\`diff\n- Impossible de récupérer le profil de ${target.username}.\n\`\`\``,
      });
    }

    // Calcul des jours depuis la création du compte
    const createdAt = new Date(Number(BigInt(fetchedUser.id) >> 22n) + 1420070400000);
    const now = new Date();
    const jourDepuis = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    const createdFormatted = createdAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + '\n' + createdAt.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(':', 'h').replace(':', 'm') + 's';

    const pseudo = fetchedUser.discriminator && fetchedUser.discriminator !== '0'
      ? `${fetchedUser.username}#${fetchedUser.discriminator}`
      : `${fetchedUser.username}.`;

    const isBot = fetchedUser.bot ? 'Oui' : 'Non';

    const asciiHeader = `+ Informations de ${pseudo}\n(${fetchedUser.id})`;

    const asciiBody = [
      ` Pseudo       → ${pseudo}`,
      ` Bot          → ${isBot}`,
      ` Créé le      → ${createdFormatted}`,
      ` Jours depuis → ${jourDepuis}`,
    ].join('\n');

    // URLs
    const avatarURL = fetchedUser.avatar
      ? `https://cdn.discordapp.com/avatars/${fetchedUser.id}/${fetchedUser.avatar}.png?size=4096`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(fetchedUser.discriminator || '0') % 5}.png`;

    const bannerURL = fetchedUser.banner
      ? `https://cdn.discordapp.com/banners/${fetchedUser.id}/${fetchedUser.banner}.${fetchedUser.banner.startsWith('a_') ? 'gif' : 'png'}?size=4096`
      : null;

    const avatarDecorationURL = fetchedUser.avatarDecorationData
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${fetchedUser.avatarDecorationData.asset}.png`
      : null;

    const userURL = `https://discord.com/users/${fetchedUser.id}`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(
        `\`\`\`diff\n${asciiHeader}\n\`\`\`` +
        `\`\`\`\n${asciiBody}\n\`\`\``
      )
      .setThumbnail(avatarURL)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    if (bannerURL) embed.setImage(bannerURL);

    // Boutons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Utilisateur')
        .setURL(userURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('👤'),
      new ButtonBuilder()
        .setLabel('Photo de profil')
        .setURL(avatarURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🖼️'),
    );

    if (avatarDecorationURL) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel('Décoration')
          .setURL(avatarDecorationURL)
          .setStyle(ButtonStyle.Link)
          .setEmoji('✨')
      );
    }

    if (bannerURL) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel('Bannière')
          .setURL(bannerURL)
          .setStyle(ButtonStyle.Link)
          .setEmoji('🖼️')
      );
    }

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  },
};