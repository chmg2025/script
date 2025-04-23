/***********************************
#!name=猫狗视频
#!desc=去广告解锁视频(支持LOON和圈X)
#!author=小白
#!date=2025-04-23
解锁站点如下: 
https://dd38dkt7dfvyr.cloudfront.net
变更站点:https://gy2025.rnuozrryfq.work
https://d2x03a61ogs2x5.cloudfront.net
https://d1xwta4tq724e9.cloudfront.net
https://d19mjemvonf47c.cloudfront.net
https://snerbnew.pxyzjmspfl.work
新增地址: https://d11rd8m1pg017m.cloudfront.net
[Rewrite]
# 广告
^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq)\.work)\/api\/(sys\/partner\/list|activity\/indexActs|sys\/advertisement\/list|sys\/getImgAndVideoCdnList|aibox\/entranceConfig) - reject-200

[Script]
# 会员
http-response ^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq)\.work)\/api\/user\/base\/info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ydm.js, requires-body=true, timeout=60, tag=会员
# 视频
http-response ^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq)\.work)\/api\/video\/getVideoById script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ydm.js, requires-body=true, timeout=60, tag=视频
# 社区
http-response ^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq)\.work)\/api\/community\/dynamic\/dynamicInfo script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ydm.js, requires-body=true, timeout=60, tag=社区


[MITM]
hostname = *.cloudfront.net, *.pxyzjmspfl.work, *.rnuozrryfq.work
***********************************/
