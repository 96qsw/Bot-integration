const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip-info')
    .setDescription("Affiche les informations d'une adresse IP")
    .addStringOption(option =>
      option.setName('ip')
        .setDescription("L'adresse IP à analyser")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const ip = interaction.options.getString('ip');

    // Validation basique de l'IP
    const ipRegex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    if (!ipRegex.test(ip)) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Adresse IP invalide : ${ip}\n\`\`\``,
      });
    }

    let data;
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,query`);
      data = await response.json();
    } catch (err) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Erreur lors de la récupération des informations.\n\`\`\``,
      });
    }

    if (data.status === 'fail') {
      return interaction.editReply({
        content: `\`\`\`diff\n- ${data.message ?? 'Impossible de récupérer les infos pour cette IP.'}\n\`\`\``,
      });
    }

    const {
      query,
      city,
      regionName,
      country,
      countryCode,
      zip,
      isp,
      timezone,
      lat,
      lon,
    } = data;

    const codePostal = zip && zip !== '' ? zip : 'N/A';

    const asciiLines = [
      `- IP            : ${query}`,
      `- Ville         : ${city ?? 'N/A'}`,
      `- Région        : ${regionName ?? 'N/A'}`,
      `- Pays          : ${country ?? 'N/A'} (${countryCode ?? 'N/A'})`,
      `- Code Postal   : ${codePostal}`,
      ``,
      `- Fournisseur   : ${isp ?? 'N/A'}`,
      `- Fuseau Horaire: ${timezone ?? 'N/A'}`,
    ].join('\n');

    const gpsURL = `https://www.google.com/maps?q=${lat},${lon}`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setTitle('IP INFOS')
      .setDescription(`\`\`\`diff\n${asciiLines}\n\`\`\``)
      .addFields({
        name: 'Coordonnées GPS',
        value: `[${lat}, ${lon}](${gpsURL})`,
      })
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.editReply({
      embeds: [embed],
    });
  },
};