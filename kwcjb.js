/***********************************
#!name=酷我纯净版
#!desc=解锁VIP及歌曲(仅支持纯净版)
#!date=2025-09-16
#!icon = https://gitlab.com/lodepuly/iconlibrary/-/raw/main/App_icon/120px/Kuwo.png

[Script]
 # 酷我纯净版
http-response http://vip1.kuwo.cn/vip/v2/user/vip script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/kwcjb.js, requires-body=true, timeout=60, tag=会员

http-request http://nmobi.kuwo.cn/mobi.s?f=kuwo&q= script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/kwcjb.js, requires-body=true, timeout=60, tag=播放

[MITM]
hostname = *.kuwo.cn
***********************************/
