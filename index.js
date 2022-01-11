const { Client, Intents } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })
var ary = [], tmp = [], mem = [], message;
client.on('ready', () => {
  console.log(`${client.user.tag} でログインしています。`)
})
var command = {'memo':{'add':{'%s':'@mas'},'delete':{'%s':'@mds'},'list':'@ml'},'ping':'@p','help':'@h'};
var info = {'memo':'!memo (add \'string\'|delete \'string\'|list)','ping':'!ping','help':'!help'};
var com = ['memo','ping','help'];

function getHelp () {
  let tmp = '';
  com.forEach(function(value){
    tmp += `${this[value]}\n`;
  },info)
  return tmp;
}

function discommand (content) {
  if (content.charAt(0) == '!') {
    tmp = content.substr(1).split(' ');
    tmp2 = command;
    if (tmp == '') {
      return;
    }
    for (i = 0; i < tmp.length; i++) {
      if (tmp2[tmp[i] == undefined]) {
        return info[tmp[0]];
      } else {
        if (tmp2['%s'] != undefined && typeof(tmp[i]) == 'string') {
          tmp2 = tmp2['%s'];
        } else {
          tmp2 = tmp2[tmp[i]];
        }
      }
    }
    if (typeof(tmp2) == 'object' || tmp2 == undefined) {
      return info[tmp[0]];
    }
    if (tmp2.charAt(0) == '@') {
      return tmp2;
    } else {
      return info[tmp[0]];
    }
  }
}

client.on('messageCreate', async msg => { if (!msg.author.bot) {
  console.log(`受信: ${msg.content}`);
  message = msg;
  cnt = msg.content;
  cnts = msg.content.split(' ');
  tmp = discommand(msg.content);
  if (tmp != undefined) {
    if (String(tmp).charAt(0) == '!') {
      msg.channel.send(`${cnts[0].substr(1)}コマンドはこのように指定してください。\`\`\`javascript\n${tmp}\`\`\``)
    } else {
      switch(tmp) {
      case '@p':
        msg.channel.send(`pong! on ${client.ws.ping}ms`);
        break;
      case '@mas':
        mem.push(cnts[2]);
        msg.channel.send(`${cnts[2]}をメモに追加しました。`);
        break;
      case '@mds':
        if (mem.indexOf(cnts[2]) == -1) {
          msg.channel.send(`${cnts[2]}というメモはありません。`);
        } else {
          mem.splice(mem.indexOf(cnts[2]), 1);
        msg.channel.send(`${cnts[2]}をメモから削除しました。`);
        }
        break;
      case '@ml':
        msg.channel.send(`メモ一覧です。\`\`\`${mem.join('\n')}\`\`\``);
        break;
      case '@h':
        msg.channel.send(`コマンド一覧です。\`\`\`javascript\n${getHelp()}\`\`\``);
      }
    }
  }
}})

// const log = function(){
//   for (i = 0; i < tmp.length; i++) {
//     tmp[i] -= 1;
//     if (tmp[i] <= 0) {
//       message.channel.send(`${ary[i]}秒のタイマーが終了しました。`);
//       tmp.splice(i, 1);
//       ary.splice(i, 1);
//       i--;
//     }
//   }
// };

// setInterval(log, 100);

client.login(null)
