/***********************************
 #!name=91短视频
 #!desc=去广告全解锁
 #!date=2026-01-23

 [Script]
 # 91短视频 
 http-response ^https:\/\/([a-z0-9-]+\.)?(evyccjk|eppwrfh)\.(cc|com)\/pwa\.php script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91.js, requires-body=true, timeout=60, tag=91短视频

 [MITM]
 hostname = *.evyccjk.cc, *.eppwrfh.com
 ***********************************/
