const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bio')
    .setDescription("Affiche la bio d'un utilisateur")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur dont tu veux voir la bio")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const target = interaction.options.getUser('user');
    const fetchedUser = await target.fetch(true).catch(() => null);

    if (!fetchedUser) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Impossible de récupérer le profil de ${target.username}.\n\`\`\``,
      });
    }

    const pseudo = fetchedUser.discriminator && fetchedUser.discriminator !== '0'
      ? `${fetchedUser.username}#${fetchedUser.discriminator}`
      : `${fetchedUser.username}.`;

    const bio = fetchedUser.bio;

    if (!bio || bio.trim() === '') {
      return interaction.editReply({
        content: `\`\`\`diff\n- ${pseudo} (ID: ${fetchedUser.id}) n'a pas de bio définie.\n\`\`\``,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(
        `\`\`\`diff\n+ Bio de ${pseudo} (ID: ${fetchedUser.id})\n\`\`\`` +
        `\`\`\`\n${bio}\n\`\`\``
      )
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.editReply({ embeds: [embed] });
  },
};