/***********************************
#!name=JVID大陆版 + XVIDEOS免费版 
#!desc=去广告解锁会员及视频(金币视频无解)
#!date=2025-09-11

[Script]
http-response https://((kmfhb0n|l5jzr).cdv6x4x6.cc|k4.uywhqqxp.cc|p5e.x5vuztxr.cc)/front/system/(bannersetting/userGetBannerSet|banner/bannerListByMAcct|datadictionary/getDicByKeys) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=广告
http-response https://((kmfhb0n|l5jzr).cdv6x4x6.cc|k4.uywhqqxp.cc|p5e.x5vuztxr.cc)/front/media/category/listAllCategory script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=底部
http-response https://((kmfhb0n|l5jzr).cdv6x4x6.cc|k4.uywhqqxp.cc|p5e.x5vuztxr.cc)/front/cluser/c/user/info/get script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=会员
http-response https://((kmfhb0n|l5jzr).cdv6x4x6.cc|k4.uywhqqxp.cc|p5e.x5vuztxr.cc)/front/media/getMediaById script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=视频
http-response https://((kmfhb0n|l5jzr).cdv6x4x6.cc|k4.uywhqqxp.cc|p5e.x5vuztxr.cc)/front/cluser/c/user/mac/login script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/jvid.js, requires-body=true, timeout=60, tag=登录

[MITM]
hostname = k4.uywhqqxp.cc, *.cdv6x4x6.cc, p5e.x5vuztxr.cc
***********************************/
