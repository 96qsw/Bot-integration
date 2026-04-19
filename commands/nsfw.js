const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nsfw')
    .setDescription('Affiche du contenu NSFW selon le type sélectionné')
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1)
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type de NSFW')
        .setRequired(true)
        .addChoices(
          { name: 'blowjob', value: 'blowjob' },
          { name: 'hentai', value: 'hentai' },
          { name: 'feet', value: 'feet' },
          { name: 'anal', value: 'anal' },
          { name: 'pussy', value: 'pussy' }
        )
    ),

  async execute(interaction) {
    const type = interaction.options.getString('type');

    // Vérifie si la commande est utilisée dans un salon NSFW
    if (!interaction.channel.nsfw) {
      return interaction.reply({ content: 'Cette commande ne peut être utilisée que dans un salon NSFW.', ephemeral: true });
    }

    const asciiLines = [
      `= Contenu NSFW de type : ${type}`,
      `→ Voici ton contenu (simulé).`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(`\`\`\`fix\n${asciiLines}\n\`\`\``)
      .setFooter({
        text: `'est pas bien tout ça, je te pensais pas comme ça en vrai, je te surveille tkt tu vas pas t’échapper• ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.reply({ embeds: [embed] });
  },
};