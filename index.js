// const { Client, Intents , Discord ,MessageEmbed } = require('discord.js');
const { Client ,GatewayIntentBits, Partials, AttachmentBuilder ,EmbedBuilder} = require('discord.js');
const Canvas = require('canvas');
const timers = require('timers');
const config = require('./data/config.json');
// const { Client, IntentsBitField } = require('discord.js');

// Create a new instance of the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
})
// Define activities
const activities = [
    { name: 'Welcome to Strony Kingdom', type: 'LISTENING' },
    { name: '#Welcome', type: 'WATCHING' }
];
let activityIndex = 0;
const activitytime = 30000; // Activity update interval in milliseconds

// On Ready
client.on('ready', () => {
    console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    // Update activity every 30 seconds
    setInterval(() => {
        activityIndex = activityIndex === activities.length ? 0 : activityIndex;
        client.user.setActivity(activities[activityIndex].name, { type: activities[activityIndex].type });
        activityIndex++;
    }, activitytime);
});

// On Message
client.on("messageCreate", async message => {
    if (message.author.bot) return; // Ignore bot messages

// On MemberAdd
client.on('guildMemberAdd', async member => {
    const channel = testGuild.channels.cache.find(chnl => chnl.name === config.welcome_channel);
        if (!channel) {
            console.log("Set channel name in config.");
            return;
        }

        try {
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');

            const background = await Canvas.loadImage('./wallpaper.jpg');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`Welcome to ${testGuild.name}! ${testMember.displayName}`, 150, 200);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(testMember.user.displayAvatarURL({ extension: 'jpg' }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');

            const embed = new EmbedBuilder()
                .setColor("#00c6ff")
                .setDescription(`Welcome to the server, ${testMember}!`)
                .setImage('attachment://welcome-image.png');

            channel.send({ embeds: [embed],files:[attachment] });

            const logs = testGuild.channels.cache.find(chnl => chnl.name === config.logchannel);
            if (logs) {
                logs.send(`> :inbox_tray: ${testMember} **has Joined ${testGuild.name}.**`);
            }
        } catch (error) {
            console.error('Error creating welcome canvas:', error);
        }

        return;
});

// On MemberRemove
client.on('guildMemberRemove', member => {
    const logs = member.guild.channels.cache.find(chnl => chnl.name === config.logchannel);
    if (logs) {
        logs.send(`> :outbox_tray: ${member.user.tag} **has left ${member.guild.name}.**`);
    }
});

// Log Client In
client.login(config.token);
