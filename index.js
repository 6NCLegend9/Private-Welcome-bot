const Discord = require('discord.js');
const Canvas = require('canvas');

const { MessageEmbed } = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
    	console.log('Log as Cloud  Alpha#8386');

 const activities = [
    { name: 'Welcome to `server name', type: 'LISTENING' }, 
    { name: '#Welcome', type: 'WATCHING' }
  ];

  client.user.setPresence({ status: 'online', activity: activities[0] });
  let activity = 1;

  // Update activity every 30 seconds
  setInterval(() => {
    activities[2] = { name: `Cloud bots!`, type: 'WATCHING' };
     activities[3] = { name: `${client.users.cache.size} users`, type: 'WATCHING' };
    if (activity > 3) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 30000);
});



client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');
  
  // You can add change the image remove the old `wallpaper.jpg` file image and replace it with new
	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '24px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to Cloud Support,', canvas.width / 1.5, canvas.height / 2.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.user.tag}`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.save();
    ctx.closePath();
    ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
	member.roles.add("635408314229981215");
	
	const embed = new Discord.MessageEmbed()
	.setColor("#ffffff")
.attachFiles(attachment)
.setAuthor('member.user.tag')
.setImage('attachment://welcome-image.png')
.setDescription(`Welcome to ${message.guild.name}`);
channel.send(embed)

});
client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'logs');
channel.send(`:inbox_tray: **${member.user.tag}** (\`${member.id}\`) has just joined the server`)
});
client.on('guildMemberRemove', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'logs');
channel.send(`:outbox_tray:  **${member.user.tag}** (\`${member.id}\`) has just left the server.`)
});


client.login(config.token);
