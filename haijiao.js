/****************************

#!name = 海角社区
#!desc = 去广告全解锁
#!date = 2025-10-26

[Script]
http-response https:\/\/haijiao\.com\/api\/(user\/current|topic\/\d+|attachment|banner\/banner_list) requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/haijiao.js, tag=海角社区

[Mitm]
hostname = haijiao.com
****************************/
