/***********************************
 #!name=麻豆视频 + 快手萝莉
 #!desc=去广告解锁视频(支持LOON和圈X)
 #!author=小白
 #!date=2025-09-21
 #!openUrl= https://d1skbu98kuldnf.cloudfront.net/home

 [Script]
 # 会员
 http-response https://(d1skbu98kuldnf|dnt92ffcqr0xu).cloudfront.net/api/app/user/info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mdsp.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response https://(d1skbu98kuldnf|dnt92ffcqr0xu).cloudfront.net/api/app/media/play script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mdsp.js, requires-body=true, timeout=60, tag=视频
 # 广告
 http-response https://(d1skbu98kuldnf|dnt92ffcqr0xu).cloudfront.net/(api/app/ping/config|api/app/media/v5/home) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mdsp.js, requires-body=true, timeout=60, tag=广告


 [MITM]
 hostname = *.cloudfront.net
 ***********************************/
