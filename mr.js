/***********************************
 #!name=Mr先生 + xvideos社区 + 泡芙短视频 + tiktok免费版
 #!desc=去广告解锁视频(支持Quantumult X 和 LOON)
 #!author=小白
 #!date=2025-06-13

 [Script]
 # 会员
 http-response ^https:\/\/([a-z0-9-]+\.cloudfront\.net|7yhgyt\.com|jnhb8y79\.com|ql2u9\.com|3e8qs\.com|cpmg23\.com|g7926j\.com)\/api\/app\/mine\/info$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mr.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response ^https:\/\/([a-z0-9-]+\.cloudfront\.net|7yhgyt\.com|jnhb8y79\.com|ql2u9\.com|3e8qs\.com|cpmg23\.com|g7926j\.com)\/api\/app\/vid\/info\?data=.*$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mr.js, requires-body=true, timeout=60, tag=视频
 # 广告
http-response ^https:\/\/([a-z0-9-]+\.cloudfront\.net|7yhgyt\.com|jnhb8y79\.com|ql2u9\.com|3e8qs\.com|cpmg23\.com|g7926j\.com)\/api\/app\/ping\/domain\/h5$ script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/mr.js, requires-body=true, timeout=60, tag=广告


 [MITM]
 hostname = *.cloudfront.net, 7yhgyt.com, jnhb8y79.com, ql2u9.com, 3e8qs.com, cpmg23.com, g7926j.com
 ***********************************/
