const { Client, Intents, WebhookClient } = require('discord.js');
const client = new Client({ intents: 3276799, restRequestTimeout: 60000, });

const token = 'discord.gg/1743'; // Bot tokeninizi buraya girin
const guildId = 'discord.gg/1743'; // Sniper kurduğunuz sunucu ID'nizi buraya girin
const roleId = 'discord.gg/1743'; // Yetkisi kapatılacakk rol ID'nizi buraya girin
const webhookUrl = 'discord.gg/1743'; // Webhook URL'nizi buraya girin

const webhookClient = new WebhookClient({ url: webhookUrl });

client.on('ready', () => {
    console.log(` Hey, ${client.user.tag} Adlı bota giriş yaptım!`);
});

client.on('guildUpdate', async(oldGuild, newGuild) => {
    if (newGuild.id !== guildId) return;

    const oldVanity = oldGuild.vanityURLCode;
    const newVanity = newGuild.vanityURLCode;

    if (oldVanity !== newVanity) {
        const role = await newGuild.roles.fetch(roleId);
        if (role) {
            await role.setPermissions([]);
            console.log(`${role.name} rolü için izinler kapatıldı.`);
        }
        webhookClient.send(`discord.gg/${newVanity}, ||@everyone||`);
    }
});

client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;
    if (message.guild.id !== guildId) return;

    const role = await message.guild.roles.fetch(roleId);

    if (message.content === '.aç') {
        // Rol izinlerini aç
        await role.setPermissions(['ADMINISTRATOR']);
        message.channel.send('Rol izinleri açıldı. /1743');
    } else if (message.content === '.kapat') {
        // Rol izinlerini kapat
        await role.setPermissions([]);
        message.channel.send('Rol izinleri kapatıldı. /1743');
    }
});
//discord.gg/1743
client.on('guildMemberAdd', async member => {
    console.log(`Yeni üye katıldı: ${member.user.tag}`);
    if (member.guild.id === guildId) {
        try {
            await member.kick('Otomatik kick sistemi');
            console.log(`Üye atıldı: ${member.user.tag}`);
        } catch (error) {
            console.error(`Üye atılırken hata oluştu: ${error}`);
        }
    }
});

async function getVanityUrl(guild) {
    try {
        const vanityData = await guild.fetchVanityData();
        return vanityData.code;
    } catch (error) {
        console.error('Vanity URL alınırken bir hata oluştu: /1743', error);
        return null;
    }
}

client.login(token);