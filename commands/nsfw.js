const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios'); 

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
    await interaction.deferReply(); 

    try {
      const response = await axios.get(`https://nekobot.xyz/api/image?type=${type}`);
      const imageUrl = response.data.message;

      const embed = new EmbedBuilder()
        .setColor(0x2C2F33)
        .setTitle(`\`+ Voici une image NSFW ${type}`)
        .setImage(imageUrl)
        .setFooter({
          text: `C'est pas bien tout ça, je te pensais pas comme ça en vrai, je te surveille tkt tu vas pas t’échapper • ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image :', error);
      await interaction.editReply({ content: 'Une erreur est survenue lors de la récupération de l\'image.', ephemeral: true });
    }
  },
};