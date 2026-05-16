#!name=吃瓜网
#!desc=去广告www.mrds66.com, hl365.com, 51cg1.com



[Script]
# > Rx去广告
http-response ^https?:\/\/www\.mrds66\.com(?!.*\.(css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp[34]|webm|m3u8|ts|json|xml|txt)) script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/Chigua/Chigua_Clean.js, requires-body=true, timeout=60, tag=Chigua_Clean

# > 黑料不打烊
http-response ^https?:\/\/hl365\.com(?!.*\.(css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp[34]|webm|m3u8|ts|json|xml|txt)) script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/Chigua/Chigua_Clean.js, requires-body=true, timeout=60, tag=Chigua_Clean

# > 51吃瓜网
http-response ^https?:\/\/51cg1\.com(?!.*\.(css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp[34]|webm|m3u8|ts|json|xml|txt)) script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/Chigua/Chigua_Clean.js, requires-body=true, timeout=60, tag=Chigua_Clean

[MITM]
hostname = www.mrds66.com, hl365.com, 51cg1.com