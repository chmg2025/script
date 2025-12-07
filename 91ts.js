/***********************************
 #!name=91系列通杀
 #!desc=去广告全解锁[暂时解锁海角社区和微性，后续添加]
 #!date=2025-12-07

 [Script]
 # 广告
 http-response ^https:\/\/(api2\.upwqjcun\.cc|bak\.haijiaoc\.com|api2\.xivjndn\.xyz|wapi\.wxav\.cc)\/(api|api\.php\/api)\/(home\/getconfig|(tabnew|novel|porngame)\/.*|community\/topics|contents\/list_contents) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=广告
 # 会员
 http-response https://(api2.upwqjcun.cc|bak.haijiaoc.com|api2.xivjndn.xyz|wapi.wxav.cc)/(api|api.php/api)/users/base_info script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response https://(api2.upwqjcun.cc|bak.haijiaoc.com|api2.xivjndn.xyz|wapi.wxav.cc)/(api|api.php/api)/mv/detail script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=视频
 # 社区
 http-response https://(api2.upwqjcun.cc|bak.haijiaoc.com|api2.xivjndn.xyz|wapi.wxav.cc)/(api|api.php/api)/community/post_detail script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=社区


 [MITM]
 hostname = *.upwqjcun.cc, *.haijiaoc.com, *.xivjndn.xyz, *.wxav.cc
 ***********************************/
