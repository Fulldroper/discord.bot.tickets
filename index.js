const fs = require("fs");
const { v4: token } = require('uuid');
const {Client, Intents} = require("discord.js")
const bot = new Client({
  intents: [
      Intents.FLAGS.GUILDS, 
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES
  ] 
})
const rep_team = "902908028666400809"
bot.on("ready", function () {
  console.log(this.user.tag, this.user.presence.status)
})
bot.on("message",async msg => {
  if (["report","rep","жалоба"].includes(msg.content)) {
    const tread = await msg.channel.threads.create({
      //🏷️
      name: `Жалоба-${msg.author.id}-${token()}`,
      // type: 'GUILD_PRIVATE_THREAD',
      autoArchiveDuration: 1440,
      reason: `rep`,
    })
    tread.send(`${msg.author}, Опишите вашу жалобу подробнее и наша команда вам поможет <@&${rep_team}>, если ваша проблема решена напишите \`close\``)
  } else if (["close"].includes(msg.content)) {
    try {
      const author = msg?.channel?.name?.match(/^Жалоба-([^-}]+)-.*/)[1]
      if (msg.author.id === author) {
        msg.channel.setArchived(true)
      }
      return;
    } catch (error) {
      return;
    }
  } else if (/^Жалоба\-.*/.test(msg.content)) {
    msg.delete()
  }
})
bot.on("interactionCreate", async function (interaction) {
  if (interaction.customId[0] === this.settings.commands.char) {
      await interaction.deferReply();
      await interaction.deleteReply();

      const msg = interaction.message
      msg.user = interaction.user,
      msg.member = interaction.member,
      msg.content = (interaction.values?.length > 0) ? `${interaction.customId} ${interaction.values.join()}` : interaction.customId,
      msg.author = interaction.user,
      msg.client = this
      this.emit('message',msg)
  } else {
      console.log(interaction, interaction.values);
      await interaction.reply({
          content: 'Ошибка выполнения команды',
          ephemeral: true 
      });
  }
})
fs.readFile(`rep.token`, (_,b) => {bot.login(b.toString())});