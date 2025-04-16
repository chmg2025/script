/***********************************
#!name=通杀
#!desc=解锁VIP视频
#!author=小白
#!date=2025-04-16

[Script]
http-response ^https:\/\/[^\/]*\.(.*\.cn)(\/\w+\/[a-z0-9]{32}\/[a-z0-9]{32}\.m3u8)(\?.*)?$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ts.js, requires-body=true, timeout=60, tag=通杀

[MITM]
hostname = *.ivldhj.cn, *.cn
***********************************/
