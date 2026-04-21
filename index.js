const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function deployCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.log('❌ Dossier "commands" non trouvé !');
    return false;
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
     
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
      console.log(`✅ Commande chargée: ${command.data.name}`);
    } else {
      console.log(`[⚠️] La commande ${file} n'a pas de "data" ou "execute".`);
    }
  }

  if (commands.length === 0) {
    console.log('❌ Aucune commande à déployer !');
    return false;
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log(`\n🚀 Déploiement de ${commands.length} commandes globales...`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Toutes les commandes ont été enregistrées avec succès !');
    console.log('📝 Elles apparaîtront maintenant dans tes Authorized Apps.\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du déploiement:', error);
    return false;
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} est en ligne ! (Mode User App)`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Aucune commande trouvée pour ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ 
      content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.', 
      ephemeral: false 
    });
  }
});

async function start() {

  const deployed = await deployCommands();
  
  if (!deployed) {
    console.log('⚠️ Continuons quand même avec le bot...');
  }
  

  try {
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}


start();

process.on('unhandledRejection', error => {
  console.error('❌ Erreur non gérée:', error);
});
