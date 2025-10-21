/***********************************
 #!name=TsBox
 #!desc=解锁VIP(支持Quantumult X 和 Loon)
 #!date=2025-10-21
 #!openUrl = https://tsbox0.top
 [Script]
 http-response ^https:\/\/[^\/]+\.tsboxhost\.top\/api\/token_login\?.* script-path=https://raw.githubusercontent.com/chmg2025/js/refs/heads/main/tsbox.js, requires-body=true, timeout=60, tag=会员

 [MITM]
 hostname = *.tsboxhost.top
 ***********************************/
