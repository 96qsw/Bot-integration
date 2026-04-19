const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calcul')
    .setDescription('Calcule une expression mathématique')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('L\'expression à calculer (ex: 2+2, 10*5, 100/4)')
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const expression = interaction.options.getString('expression');

  
    const safeRegex = /^[0-9+\-*/.() %^]+$/;
    if (!safeRegex.test(expression)) {
      return interaction.reply({
        content: `\`\`\`diff\n- Expression invalide. Utilise uniquement des chiffres et opérateurs (+, -, *, /, %).\n\`\`\``,
        ephemeral: false,
      });
    }

    let result;
    try {
      result = Function('"use strict"; return (' + expression + ')')();
      if (!isFinite(result)) throw new Error('Résultat infini');
    } catch {
      return interaction.reply({
        content: `\`\`\`diff\n- Expression mathématique invalide.\n\`\`\``,
        ephemeral: true,
      });
    }

    const asciiLines = [
      `- Expression :`,
      `  ${expression}`,
      ``,
      `+ Résultat :`,
      `  ${result}`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`diff\n${asciiLines}\n\`\`\``)
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};