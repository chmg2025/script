/****************************
#!name = 亿启秀(无效)
#!desc = 测试(无效)
#!author = 小白
#!date = 2025-06-23


[Script]
http-response https://www.xixixtv.cc/hapi/liveDevice/index requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/yqx.js, tag=亿启秀

[Mitm]
hostname = www.xixixtv.cc
****************************/

let body = JSON.parse($response.body)
body.forEach(item => {
    item.isVip = 1;
});
$done({body:JSON.stringify(body)})