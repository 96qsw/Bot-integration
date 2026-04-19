const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lettres-gen')
    .setDescription('Génère une chaîne aléatoire de lettres')
    .addIntegerOption(option =>
      option.setName('longueur')
        .setDescription('Nombre de lettres à générer (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const longueur = interaction.options.getInteger('longueur');

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < longueur; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`\nChaîne aléatoire de ${longueur} lettres générée :\n\`\`\``)
      .addFields({
        name: 'Résultat',
        value: `\`\`\`\n${result}\n\`\`\``,
      })
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};