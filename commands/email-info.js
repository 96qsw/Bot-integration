const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('email-info')
    .setDescription("Analyse une adresse email")
    .addStringOption(option =>
      option.setName('email')
        .setDescription("L'adresse email à analyser")
        .setRequired(true)
    )
    .setContexts(0, 1, 2)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const email = interaction.options.getString('email');

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Adresse email invalide : ${email}\n\`\`\``,
      });
    }

    const domain = email.split('@')[1];

  
    let disifyData = null;
    let mxValid = false;
    let dnsValid = false;

    try {
      // Disify : email jetable + domaine
      const [disifyRes, domainRes] = await Promise.all([
        fetch(`https://www.disify.com/api/email/${encodeURIComponent(email)}`),
        fetch(`https://www.disify.com/api/domain/${encodeURIComponent(domain)}`),
      ]);

      disifyData  = await disifyRes.json();
      const domainData = await domainRes.json();

      mxValid  = domainData?.mx   ?? false;
      dnsValid = domainData?.dns  ?? false;

    } catch (err) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Erreur lors de l'analyse : ${err.message}\n\`\`\``,
      });
    }

    const bool = (val) => val === true ? '✅ Oui' : '❌ Non';

    const isDisposable  = disifyData?.disposable  ?? false;
    const isFormatValid = disifyData?.format       ?? false;
    const domainSuggest = disifyData?.domain       ?? 'N/A';

    const lines = [
      ` Format valide          : ${bool(isFormatValid)}`,
      ` Domaine suggéré        : ${domainSuggest !== domain ? domainSuggest : 'N/A'}`,
      ``,
      ` DNS valide             : ${bool(dnsValid)}`,
      ` MX trouvé              : ${bool(mxValid)}`,
      ` Email jetable          : ${bool(isDisposable)}`,
      ` Email suspect          : ${bool(isDisposable)}`,
      ` Free Email Provider    : ${bool(['gmail.com','hotmail.com','yahoo.com','outlook.com','live.com','icloud.com'].includes(domain))}`,
      ``,
      ` Domaine                : ${domain}`,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2C2F33)
      .setDescription(
        `\`\`\`fix\n= Adresse Email analysée : ${email}\n\`\`\`` +
        `\`\`\`\n${lines}\n\`\`\``
      )
      .setFooter({
        text: `Today at ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });

    await interaction.editReply({ embeds: [embed] });
  },
};