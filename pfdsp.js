/***********************************
 #!name=泡芙短视频
 #!desc=去广告全解锁(支持Loon和圈X)
 #!author=小白
 #!date=2025-04-13
 [Script]
 http-response https://(jnhb8y79.com|d5flxjpige3b9.cloudfront.net)/api/app/ping/domain/h5 script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/pfdsp.js, requires-body=true, timeout=60, tag=广告
 http-response https://(jnhb8y79.com|d5flxjpige3b9.cloudfront.net)/api/app/mine/info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/pfdsp.js, requires-body=true, timeout=60, tag=会员
 http-response ^https:\/\/(jnhb8y79\.com|d5flxjpige3b9\.cloudfront\.net)\/api\/app\/vid\/info\?data=.*$ script-path=https://raw.githubusercontent.com/chmg2025/jst/refs/heads/main/pfdsp.js, requires-body=true, timeout=60, tag=视频


 [MITM]
 hostname = jnhb8y79.com, *.cloudfront.net
 ***********************************/
