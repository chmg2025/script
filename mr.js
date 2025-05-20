/***********************************
 #!name=Mr.好色
 #!desc=去广告解锁视频(支持Quantumult X 和 LOON)
 #!author=小白
 #!date=2025-05-20
 #!openUrl = https://d2kz22zwxc5env.cloudfront.net/

 [Script]
 # 会员
 http-response https://(3e8qs.com|(d2m18pn7x0p3im|d27nudycn51u9q).cloudfront.net)/api/app/mine/info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mr.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response ^https:\/\/(3e8qs\.com|(d2m18pn7x0p3im|d27nudycn51u9q)\.cloudfront\.net)\/api\/app\/vid\/info\?data=.*$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mr.js, requires-body=true, timeout=60, tag=视频
 # 广告
 http-response https://(3e8qs.com|(d2m18pn7x0p3im|d27nudycn51u9q).cloudfront.net)/api/app/ping/domain/h5 script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mr.js, requires-body=true, timeout=60, tag=广告


 [MITM]
 hostname = 3e8qs.com, *.cloudfront.net
 ***********************************/
