const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const QRCode = require('qrcode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar d'un utilisateur sous forme de QR Code")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux l'avatar")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const target = interaction.options.getUser('user');

    // Récupère l'avatar en haute qualité
    const avatarURL = target.displayAvatarURL({ extension: 'png', size: 1024 });

    // Génère le QR Code de l'image de l'avatar (et non du lien)
    const qrBuffer = await QRCode.toBuffer(avatarURL, {
      width: 280,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const qrAttachment = new AttachmentBuilder(qrBuffer, { name: 'avatar-qrcode.png' });

    // Texte en style ascii comme sur ton image
    const asciiText = `asciiDocVoici l'avatar de ${target.username}.\n(${target.id}) :`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`asciidoc\n${asciiText}\n\`\`\``)
      .setFooter({ 
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
      })
      .setTimestamp();

    // Bouton "Avatar"
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Avatar')
        .setURL(avatarURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🖼️')
    );

    await interaction.editReply({
      embeds: [embed],
      files: [qrAttachment],     
      components: [row]
    });
  },
};