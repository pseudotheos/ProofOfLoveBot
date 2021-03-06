const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

//text generator
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Generates your web3 profile card!'),
	async execute(interaction) {
		// Create a 1200x675 pixel canvas and get its context
		// The context will be used to modify the canvas
		const canvas = Canvas.createCanvas(1200, 675);
		const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./wallpaper.jpg');

	    // This uses the canvas dimensions to stretch the image onto the entire canvas
	    context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        context.font = '50px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText('BING BONG', canvas.width / 2.5, canvas.height / 2.5);

		context.font = applyText(canvas, `${interaction.member.displayName}`);
		context.fillStyle = '#ffffff';
		context.fillText(`${interaction.member.displayName}`, canvas.width / 2.5, canvas.height / 4);

	    // Cut out circular mask for profile picture
	    context.beginPath();
	    context.arc(150, 150, 100, 0, Math.PI * 2, true);
	    context.closePath();
	    context.clip();
        //load user avatar
        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));
	    // Draw avatar onto the main canvas
	    context.drawImage(avatar, 50, 50, 200, 200);
        


	    // process image and send to user
	    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

	    interaction.reply({ files: [attachment] });
		// ...
	},
};