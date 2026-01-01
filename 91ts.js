/***********************************
 #!name=91系列通杀
 #!desc=去广告全解锁(解锁列表:【海角社区, 微性, 小红书, 潘多拉】)
 #!date=2026-01-01


 [Script]
 # 广告
 http-response ^https:\/\/[^\/]+\.(cc|xyz|com|net)\/(api|api\.php\/api)\/(home\/(getconfig|config)|(tabnew|novel|porngame)\/.*|community\/(topics|construct)|contents\/list_contents|search\/hotSearch|index\/index) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=广告
 # 会员
 http-response https://[^\/]+\.(cc|xyz|com|net)/(api|api.php/api)/(users/base_info|user/userinfo) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response https://[^\/]+\.(cc|xyz|com|net)/(api|api.php/api)/(mv/(detail|getDetail|list_construct)|[^\/]+/(detail|get_detail)) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=视频
 # 社区
 http-response https://[^\/]+\.(cc|xyz|com|net)/(api|api.php/api)/community/post_detail script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=社区
 # 列表
 http-response https://[^\/]+\.(cc|xyz|com|net)/(api|api.php/api)/(pjapp/index|seed/(post|detail)) script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/91ts.js, requires-body=true, timeout=60, tag=列表

 [MITM]
 hostname = *.cc, *.xyz, *.com, *.net
 ***********************************/
