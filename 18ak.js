/***********************************
 #!name=18AK漫画
 #!desc=解锁VIP及视频
 #!author=小白
 #!date=2025-04-11
 [Script]
 http-response https://18akmanhua.com/api/memberDetails script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/18ak.js, requires-body=true, timeout=60, tag=会员
 http-response ^https:\/\/18akmanhua\.com\/api\/videoDetails\?id=\d+$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/18ak.js, requires-body=true, timeout=60, tag=视频
 http-response https://18akmanhua.com/api/playNewVideos script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/18ak.js, requires-body=true, timeout=60, tag=播放

 [MITM]
 hostname = 18akmanhua.com
 ***********************************/
