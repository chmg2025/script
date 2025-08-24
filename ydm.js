/***********************************
#!name= YDM系列通杀
#!desc=去广告解锁视频(支持LOON和圈X)
#!author=小白
#!date=2025-08-24
解锁站点如下: 
DeepSeek: https://d2x03a61ogs2x5.cloudfront.net
YDM:  https://dd38dkt7dfvyr.cloudfront.net
MLS:  https://mh0619.djfrhyhtuo.work
JJ:   https://d19mjemvonf47c.cloudfront.net
UUSP: https://d11rd8m1pg017m.cloudfront.net
91YM: https://df1dkslnws674.cloudfront.net
3N2B: https://snerbnew.pxyzjmspfl.work
MGQ:  https://aw0702.x5t5d5a4c.work/
BZSP: https://fyb1.looufegitw.work
MXBC: https://jsj5191.h6b7f5t4n.work/
GGS:  https://ggs1.gtlxb.work
[Rewrite]
# 广告
^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq|looufegitw|h6b7f5t4n|x5t5d5a4c|djfrhyhtuo|gtlxb)\.work)\/api\/(sys\/partner\/list|activity\/indexActs|sys\/advertisement\/list|sys\/getImgAndVideoCdnList|aibox\/entranceConfig|all\/ad\/place\/list) - reject-200

[Script]
# 会员
http-response ^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq|looufegitw|h6b7f5t4n|x5t5d5a4c|djfrhyhtuo|gtlxb)\.work)\/api\/user\/base\/info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ydm.js, requires-body=true, timeout=60, tag=会员
# 视频
http-response ^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq|looufegitw|h6b7f5t4n|x5t5d5a4c|djfrhyhtuo)\.work)\/api\/video\/getVideoById script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ydm.js, requires-body=true, timeout=60, tag=视频
# 社区
http-response ^https:\/\/[^\/]+\.(cloudfront\.net|(pxyzjmspfl|rnuozrryfq|looufegitw|h6b7f5t4n)\.work|x5t5d5a4c|djfrhyhtuo)\/api\/community\/dynamic\/dynamicInfo script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/ydm.js, requires-body=true, timeout=60, tag=社区


[MITM]
hostname = *.cloudfront.net, *.pxyzjmspfl.work, *.rnuozrryfq.work, *.looufegitw.work, *.h6b7f5t4n.work, *.x5t5d5a4c.work, *.djfrhyhtuo.work, *.gtlxb.work
***********************************/
