/***********************************
#!name=JVID大陆版 + XVIDEOS免费版 
#!desc=去广告解锁会员及视频(金币视频无解)
#!date=2025-09-20

[Script]
http-response https://[^/]+/front/system/(bannersetting/userGetBannerSet|banner/bannerListByMAcct|datadictionary/getDicByKeys) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=广告
http-response https://[^/]+/front/media/category/listAllCategory script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=底部
http-response https://[^/]+/front/cluser/c/user/info/get script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=会员
http-response https://[^/]+/front/media/getMediaById script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=视频
http-response https://[^/]+/front/cluser/c/user/mac/login script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=登录

[MITM]
hostname = *.uywhqqxp.cc, *.cdv6x4x6.cc, *.x5vuztxr.cc, *.sgmn3p7k.cc, *.y9wgsnn3.cc
***********************************/
