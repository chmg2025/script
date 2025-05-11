/***********************************
 #!name=91anwan
 #!desc=去广告全解锁(支持Loon和圈X）
 #!author=小白
 #!date=2025-05-11


 [Script]
 # 会员
 http-response https://dvsela5d0ca40.cloudfront.net/api/app/mine/info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91anwan.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response ^https:\/\/dvsela5d0ca40\.cloudfront\.net\/api\/app\/vid\/info\?data=.*$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91anwan.js, requires-body=true, timeout=60, tag=视频
 # 广告
 http-response https://dvsela5d0ca40.cloudfront.net/api/app/ping/domain/h5 script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91anwan.js, requires-body=true, timeout=60, tag=广告


 [MITM]
 hostname = *.cloudfront.net
 ***********************************/
