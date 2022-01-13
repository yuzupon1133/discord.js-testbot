const { Client, Intents } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })
var timername = [], timernow = [], timersecond = [], memo = [], message;
client.on('ready', () => {
  console.log(`${client.user.tag} でログインしています。`)
})
var command = 
{
  'memo':{'add':{'%s':'@mas'},'delete':{'%s':'@mds'},'list':'@ml'},
  'ping':'@p',
  'help':{'%u':'@h','%s':'@hs'},
  'timer':{'set':{'%i':{'%u':'@tsi','%s':'@tsis'}},'reset':{'%s':'@trs'},'list':'@tl'},
  'say':{'%s':'@ss'},
  'status':{'%i':'@si'},
  'test':'@t'
};
// %s string, %i int, %u undefined
var info = 
{
  'memo':'!memo (add \'内容\'|delete \'内容\'|list)',
  'ping':'!ping',
  'help':'!help (\'コマンド名\')',
  'timer':'!timer (set \'秒数\' (\'題名\')|reset \'題名\'|list)',
  'say':'!say \'内容\'',
  'status':'!status \'ユーザID\''
};
var com = ['help','ping','memo','timer','say','status'];

function getTimer () {
  let tmp = '';
  for (i = 0; i < timername.length; i++) {
    tmp += `\'${timername[i]}\' 残り${Math.floor(timernow[i]/1000)+timersecond[i]-Math.floor(Date.now()/1000)}秒\n`;
  }
  return tmp;
}

function sizensu (int) {
  return (Math.ceil(int) == int && int >= 0);
}

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
      if (tmp2['%s'] != undefined && typeof(tmp[i]) == 'string') {
        tmp2 = tmp2['%s'];
      } else if (tmp2['%i'] != undefined && !isNaN(Number(tmp[i]))) {
        tmp2 = tmp2['%i'];
      } else if (tmp2[tmp[i]] == undefined) {
        return info[tmp[0]];
      } else {
        tmp2 = tmp2[tmp[i]];
      }
    }
    if (tmp2['%u'] != undefined) {
      return tmp2['%u'];
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
  console.log(`受信: ${msg.content} (by ${msg.author.username})`);
  message = msg;
  cnt = msg.content;
  cnts = msg.content.split(' ');
  tmp = discommand(msg.content);
  if (tmp != undefined) {
    if (String(tmp).charAt(0) == '!') {
      msg.channel.send(`${cnts[0].substr(1)}コマンドはこのように指定してください。\`\`\`javascript\n${tmp}\`\`\``);
    } else {
      console.log(`コマンド実行: ${tmp}`);
      ttmp = Date.now();
      switch(tmp) {
        case '@p':
          msg.channel.send(`pong! on ${client.ws.ping}ms`);
          break;
        case '@mas':
          memo.push(cnts[2]);
          msg.channel.send(`${cnts[2]}をメモに追加しました。`);
          break;
        case '@mds':
          if (memo.indexOf(cnts[2]) == -1) {
            msg.channel.send(`${cnts[2]}というメモはありません。`);
          } else {
            memo.splice(memo.indexOf(cnts[2]), 1);
          msg.channel.send(`${cnts[2]}をメモから削除しました。`);
          }
          break;
        case '@ml':
          if (memo.length == 0) {
            msg.channel.send(`メモはありません。`);
          } else {
            msg.channel.send(`メモ一覧です。\`\`\`${memo.join('\n')}\`\`\``);
          }
          break;
        case '@h':
          msg.channel.send(`コマンド一覧です。\`\`\`javascript\n${getHelp()}\`\`\``);
          break;
        case '@hs':
          if (info[cnts[1]] == undefined) {
            msg.channel.send(`そのようなコマンドはありません。`);
          } else {
            msg.channel.send(`${cnts[1]}コマンドはこのように指定してください。\`\`\`javascript\n${info[cnts[1]]}\`\`\``);
          }
          break;
        case '@tsi':
          if (sizensu(cnts[2])) {
            timername.push(ttmp);
            timernow.push(ttmp);
            timersecond.push(Number(cnts[2]));
            msg.channel.send(`${ttmp} のタイマーを${cnts[2]}秒に設定しました。`);
          } else {
            msg.channel.send(`秒数は自然数を指定してください。`);
          }
          break;
        case '@tsis':
          if (sizensu(cnts[2])) {
            if (timername.indexOf(cnts[3]) != -1) {
              timername.push(join(ttmp, '1'));
              timernow.push(ttmp);
              timersecond.push(Number(cnts[2]));
              msg.channel.send(`${cnts[3]} のタイマーは既に使われています。\n代わりに、${join(ttmp, '1')} のタイマーを${cnts[2]}秒に設定しました。`);
            } else {
              timername.push(cnts[3]);
              timernow.push(ttmp);
              timersecond.push(Number(cnts[2]));
              msg.channel.send(`${cnts[3]} のタイマーを${cnts[2]}秒に設定しました。`);
            }
          } else {
            msg.channel.send(`秒数は自然数を指定してください。`);
          }
          break;
        case '@trs':
          if (timername.indexOf(cnts[2]) != -1) {
            timernow.splice(timername.indexOf(cnts[2]), 1);
            timersecond.splice(timername.indexOf(cnts[2]), 1);
            timername.splice(timername.indexOf(cnts[2]), 1);
            msg.channel.send(`${cnts[2]} のタイマーをリセットしました。`);
          } else {
            msg.channel.send(`${cnts[2]} というタイマーはありません。`);
          }
          break;
        case '@tl':
          if (timername.length == 0) {
            msg.channel.send(`タイマーはありません。`);
          } else {
            msg.channel.send(`タイマー一覧です。\`\`\`javascript\n${getTimer()}\`\`\``);
          }
          break;
        case '@ss':
          msg.channel.send(cnts[1]);
        case '@si':
          // user = await client.users.fetch(cnts[1]);
          // user = await client.members.fetch(cnts[1]);
          // msg.channel.send(user.presence.activities[0].state)
      }
    }
  }
}})

const log = function(){
  for (i = 0; i < timername.length; i++) {
    if (Math.floor(timernow[i]/1000)+timersecond[i]-Math.floor(Date.now()/1000) <= 0) {
      message.channel.send(`${timername[i]} のタイマーが終了しました。`);
      timernow.splice(i, 1);
      timersecond.splice(i, 1);
      timername.splice(i, 1);
      i--
    }
  }
};

setInterval(log, 500);

client.login(null)
