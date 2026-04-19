const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const QRCode = require('qrcode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar d'un utilisateur avec QR code")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux l'avatar")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const target = interaction.options.getUser('user');

    // Récupère l'URL de l'avatar en haute qualité
    const avatarURL = target.displayAvatarURL({ extension: 'png', size: 4096 });

    // Génère le QR Code de l'URL de l'avatar
    const qrCodeBuffer = await QRCode.toBuffer(avatarURL, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const qrAttachment = new AttachmentBuilder(qrCodeBuffer, { name: 'qrcode.png' });

    // Message en style ascii comme sur l'image
    const asciiText = `asciiDocVoici l'avatar de ${target.username}.\n(${target.id}) :`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`asciidoc\n${asciiText}\n\`\`\``)
      .setImage(avatarURL)           // Affiche le vrai avatar en grand
      .setFooter({ 
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
      })
      .setTimestamp();

    // Bouton "Avatar" avec lien direct
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Avatar')
        .setURL(avatarURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🖼️')
    );

    await interaction.reply({
      embeds: [embed],
      files: [qrAttachment],           // Ajoute le QR Code en haut à droite
      components: [row],
      ephemeral: true
    });
  },
};