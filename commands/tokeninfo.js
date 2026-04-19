const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('token-info')
    .setDescription("Affiche les informations d'un token Discord")
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Le token Discord à analyser')
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const token = interaction.options.getString('token');

    let userInfo;
    try {
      const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        return interaction.editReply({ content: '❌ Token invalide ou expiré.' });
      }

      userInfo = await response.json();
    } catch (err) {
      return interaction.editReply({ content: '❌ Erreur lors de la récupération des informations.' });
    }

    const {
      id,
      username,
      discriminator,
      email,
      verified,
      mfa_enabled,
      phone,
      locale,
      premium_type,
    } = userInfo;

    // Date de création depuis l'ID (Snowflake)
    const createdAt = new Date(Number(BigInt(id) >> 22n) + 1420070400000);
    const createdFormatted = createdAt.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');

    const nitroMap = {
      0: 'Aucun',
      1: 'Nitro Classic',
      2: 'Nitro Boost',
      3: 'Nitro Basic',
    };

    const pseudo = discriminator && discriminator !== '0'
      ? `${username}#${discriminator}`
      : `${username}#0`;

    const asciiText = [
      `🔍 Informations sur le Token`,
      ``,
      ` Type de compte    : 👤 Utilisateur`,
      ` Nom global        : ${username}`,
      ` Pseudo            : ${pseudo}`,
      ` ID                : ${id}`,
      ` Langue            : ${locale ?? 'N/A'}`,
      ` 2FA activé ?      : ${mfa_enabled ? '✅' : '❌'}`,
      ` E-mail            : ${email ?? 'N/A'}`,
      ` Vérifié ?         : ${verified ? '✅' : '❌'}`,
      ` Téléphone         : ${phone ?? 'N/A'}`,
      ` Nitro             : ${nitroMap[premium_type] ?? 'Aucun'}`,
      ` Badges            : Aucun`,
      ` Date de création  : ${createdFormatted}`,
    ].join('\n');

    const avatarURL = userInfo.avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${userInfo.avatar}.png?size=4096`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator || '0') % 5}.png`;

    const bannerURL = userInfo.banner
      ? `https://cdn.discordapp.com/banners/${id}/${userInfo.banner}.png?size=4096`
      : null;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`\n${asciiText}\n\`\`\``)
      .setThumbnail(avatarURL)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      });

    if (bannerURL) embed.setImage(bannerURL);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Avatar')
        .setURL(avatarURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🖼️')
    );

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