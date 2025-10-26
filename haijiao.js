/****************************

#!name = 海角社区
#!desc = 去广告解锁会员及收费视频[并非100%解锁，如遇页面异常刷新重试](支持LOON和圈X)
#!date = 2025-10-26

[Script]
http-response https:\/\/haijiao\.com\/api\/(user\/current|topic\/\d+|attachment|banner\/banner_list) requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/haijiao.js, tag=海角社区

[Mitm]
hostname = haijiao.com
****************************/
