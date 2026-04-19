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
    await interaction.deferReply({ ephemeral: true });

    const email = interaction.options.getString('email');

    // Validation basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Adresse email invalide : ${email}\n\`\`\``,
      });
    }

    let data;
    try {
      const response = await fetch(`https://api.eva.pingutil.com/email?email=${encodeURIComponent(email)}`);
      data = await response.json();
    } catch (err) {
      return interaction.editReply({
        content: `\`\`\`diff\n- Erreur lors de l'analyse de l'email.\n\`\`\``,
      });
    }

    const d = data?.data ?? {};

    const bool = (val) => val === true  ? '✅ Oui' : val === false ? '❌ Non' : 'N/A';
    const val  = (v)   => v !== undefined && v !== null ? String(v) : 'N/A';

    const lines = [
      ` Prénom trouvé          : ${val(d.first_name) === 'null' ? 'Unknown' : val(d.first_name)}`,
      ` Domaine suggéré        : ${val(d.suggested_domain) === '' ? 'N/A' : val(d.suggested_domain)}`,
      ``,
      ` Score de fraude        : ${val(d.fraud_score)}`,
      ` Score global           : ${val(d.score)}`,
      ` Score SMTP             : ${val(d.smtp_score)}`,
      ` Score piège à spam     : ${val(d.honeypot_score) === 'null' ? 'none' : val(d.honeypot_score)}`,
      ``,
      ` DNS valide             : ${bool(d.valid_dns)}`,
      ` Adresse générique      : ${bool(d.generic)}`,
      ` Email fuitée           : ${bool(d.leaked)}`,
      ` Abus récent détecté    : ${bool(d.recent_abuse)}`,
      ` Email suspect          : ${bool(d.suspect)}`,
      ` Timeout SMTP           : ${bool(d.smtp_timeout)}`,
      ` Free Email Provider    : ${bool(d.free_email_provider)}`,
      ` Email jetable          : ${bool(d.disposable)}`,
      ` MX trouvé              : ${bool(d.mx_found)}`,
      ` Catch-All              : ${bool(d.catch_all)}`,
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

    await interaction.editReply({
      embeds: [embed],
    });
  },
};