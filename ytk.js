/***********************************
 #!name = 一同看
 #!desc = 解锁收费视频
 #!date = 2025-10-27
 [Script]
 http-response ^https?:\/\/yitongkan\.club\/play-[a-fA-F0-9]{32}\.html script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/ytk.js, requires-body=true, timeout=60, tag=一同看

 [MITM]
 hostname = yitongkan.club
 ***********************************/
