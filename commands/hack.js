const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hack un utilisateur (troll DOX réaliste)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur à 'hacker'")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const target = interaction.options.getUser('user');

   
    const villes = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nantes", "Strasbourg", "Nice", "Genève"];
    const pays = ["France", "Suisse", "Belgique", "Luxembourg"];
    const prenoms = ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Moreau", "Simon", "Laurent"];

    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const fakeData = {
      nomComplet: `${target.username} ${prenoms[random(0, prenoms.length - 1)]}`,
      dateNaissance: `${random(1975, 2005)}-${String(random(1, 12)).padStart(2, '0')}-${String(random(1, 28)).padStart(2, '0')}`,
      adresse: `${random(1, 200)} rue ${["de la Paix", "Gambetta", "Victor Hugo", "Marseille", "Jean Jaurès", "Liberté"][random(0,5)]}, ${random(75000, 75020)} ${villes[random(0, villes.length-1)]}`,
      ip: `${random(80, 220)}.${random(10, 250)}.${random(10, 250)}.${random(10, 250)} (${villes[random(0, villes.length-1)]}, ${pays[random(0, pays.length-1)]})`,
      telephone: `+33 ${random(1,9)} ${random(10,99)} ${random(10,99)} ${random(10,99)} ${random(10,99)}`,
      email: `${target.username.toLowerCase()}${random(10,99)}@gmail.com`,
      mac: `${random(10,99).toString(16)}:${random(10,99).toString(16)}:${random(10,99).toString(16)}:${random(10,99).toString(16)}:${random(10,99).toString(16)}:${random(10,99).toString(16)}`.toUpperCase(),
      ssn: `${random(100,999)}-${random(10,99)}-${random(1000,9999)}`,
      discordTag: `${target.username}#${random(1000,9999)}`,
      amis: random(45, 320),
      serveurs: random(8, 47),
      nitro: ["Aucun", "Classic", "Boost", "Nitro Basic"][random(0,3)],
      banque: ["Société Générale", "BNP Paribas", "Crédit Agricole", "La Banque Postale", "HSBC"][random(0,4)],
      iban: `FR${random(76,99)} ${random(1000,9999)} ${random(1000,9999)} ${random(1000,9999)} ${random(1000,9999)} ${random(10,99)}`,
      bic: `QABY${random(1000,9999)}`,
      carte: `${random(4000,4999)} ${random(1000,9999)} ${random(1000,9999)} ${random(1000,9999)}`,
      cvv: String(random(100,999)),
      twitter: `https://twitter.com/${target.username.toLowerCase()}${random(10,99)}`,
      instagram: `https://instagram.com/${target.username.toLowerCase()}_${random(100,999)}`,
    };

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)                   
      .setTitle(`DOX de ${target.username}`)
      .setDescription(
        `**Informations personnelles**\n` +
        `• **Nom complet :** ${fakeData.nomComplet}\n` +
        `• **Date de naissance :** ${fakeData.dateNaissance}\n` +
        `• **Adresse :** ${fakeData.adresse}\n` +
        `• **Localisation IP :** ${fakeData.ip}\n` +
        `• **Téléphone :** ${fakeData.telephone}\n` +
        `• **Email :** ${fakeData.email}\n` +
        `• **MAC Adresse :** ${fakeData.mac}\n` +
        `• **SSN :** ${fakeData.ssn}\n\n` +

        `**Comptes et activité Discord**\n` +
        `• Nombre d'amis Discord : ${fakeData.amis}\n` +
        `• Nombre de serveurs Discord : ${fakeData.serveurs}\n` +
        `• Discord Tag : ${fakeData.discordTag}\n` +
        `• Nitro : ${fakeData.nitro}\n` +
        `• Boosts : ${random(0, 12)}\n\n` +

        `**Informations bancaires**\n` +
        `• Banque : ${fakeData.banque}\n` +
        `• IBAN : ${fakeData.iban}\n` +
        `• BIC : ${fakeData.bic}\n` +
        `• Numéro de carte : ${fakeData.carte}\n` +
        `• Code CVV : ${fakeData.cvv}\n` +
        `• Date d'expiration : ${random(1,12)}/${random(25,29)}\n\n` +

        `**Réseaux sociaux**\n` +
        `• Twitter : ${fakeData.twitter}\n` +
        `• Instagram : ${fakeData.instagram}\n\n` +

        `**Force à toi en vrai.**`
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 128 }))
      .setFooter({ 
        text: `Tools Bot • Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};