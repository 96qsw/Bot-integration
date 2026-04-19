const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('token-gen')
    .setDescription('Génère un token Discord aléatoire (fake)')
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
   
    const part1 = 'M' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const part2 = '_' + Math.random().toString(36).substring(2, 10);
    const part3 = Math.random().toString(36).substring(2, 15).toUpperCase();
    const part4 = '-' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6).toUpperCase();
    const part5 = '.' + Math.random().toString(36).substring(2, 30);

    const fakeToken = `${part1}${part2}${part3}${part4}${part5}`;

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)                   
      .setTitle("`Voici un token Discord généré (fake) :`")
      .setDescription(`\`\`\`${fakeToken}\`\`\``)  
      .setFooter({ 
        text: `Today at ${new Date().toLocaleTimeString}` 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false   
    });
  },
};