const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('webhook-info')
    .setDescription("Affiche les informations d'un webhook Discord")
    .addStringOption(option =>
      option.setName('url')
        .setDescription("L'URL du webhook Discord")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const url = interaction.options.getString('url');


    const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/(\d+)\/([A-Za-z0-9_\-]+)$/;
    if (!webhookRegex.test(url)) {
      return interaction.editReply({
        content: `\`\`\`diff\n- URL de webhook invalide.\n\`\`\``,
      });
    }

    let data;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        return interaction.editReply({
          content: `\`\`\`diff\n- Webhook introuvable ou supprimé.\n\`\`\``,
        });
      }
      data = await res.json();
    } catch {
      return interaction.editReply({
        content: `\`\`\`diff\n- Erreur lors de la récupération du webhook.\n\`\`\``,
      });
    }

    const typeMap = {
      1: 'Webhook standard',
      2: 'Webhook followeur',
      3: 'Application',
    };

    const {
      id,
      name,
      type,
      guild_id,
      channel_id,
      user,
      application_id,
      token,
    } = data;

    // Date de création depuis Snowflake
    const createdAt = new Date(Number(BigInt(id) >> 22n) + 1420070400000);
    const createdFormatted = createdAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + createdAt.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(':', 'h').replace(':', 'm') + 's';

    const hasToken = token ? '✅' : '❌';
    const utilisateur = user ? `${user.username} (${user.id})` : 'Aucun';
    const appId = application_id ?? 'Aucune';

    const lines = [
      ` Nom             : ${name}`,
      ` Type            : ${typeMap[type] ?? 'Inconnu'}`,
      ` ID              : ${id}`,
      ` Token présent ? : ${hasToken}`,
      ` Serveur         : ${guild_id ?? 'Aucun'}`,
      ` Salon           : ${channel_id ?? 'Aucun'}`,
      ` Utilisateur     : ${utilisateur}`,
      ` Application ID  : ${appId}`,
      ` URL Webhook     :`,
      ` ${url}`,
      ` Date création   : ${createdFormatted}`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setTitle('Informations sur le Webhook')
      .setDescription(`\`\`\`\n${lines}\n\`\`\``)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Ouvrir le webhook')
        .setURL(url)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🔗')
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  },
};