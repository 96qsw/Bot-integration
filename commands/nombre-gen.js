const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nombres-gen')
    .setDescription('Génère une chaîne aléatoire de chiffres')
    .addIntegerOption(option =>
      option.setName('longueur')
        .setDescription('Nombre de chiffres à générer (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const longueur = interaction.options.getInteger('longueur');

    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < longueur; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`\nChaîne aléatoire de ${longueur} chiffres générée :\n\`\`\``)
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