const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar d'un utilisateur")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux voir l'avatar")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const target = interaction.options.getUser('user');

    const avatarURL = target.displayAvatarURL({ extension: 'png', size: 4096 });


    const asciiText = `asciiDocVoici l'avatar de ${target.username}.\n(${target.id}) :`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)              
      .setDescription(`\`\`\`\n${asciiText}\n\`\`\``)
      .setImage(avatarURL)                
      .setFooter({ 
        text: `Today at ${new Date().toLocaleTimeString}` 
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Avatar')
        .setURL(avatarURL)
        .setStyle(ButtonStyle.Link)
        .setEmoji('🖼️')
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false   
    });
  },
};