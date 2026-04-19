const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[⚠️] La commande ${file} n'a pas de "data" ou "execute".`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Déploiement de ${commands.length} commandes globales (User App)...`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),  
      { body: commands }
    );

    console.log('✅ Toutes les commandes ont été enregistrées avec succès !');
    console.log('Elles apparaîtront maintenant dans tes Authorized Apps.');
  } catch (error) {
    console.error(error);
  }
})();