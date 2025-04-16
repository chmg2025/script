
/***********************************
 #!name=65看
 #!desc=去广告解锁视频测试
 #!author=小白
 #!date=2025-04-16


 [Rewrite]
 ^https://hm-img\.xuezhumall\.com/videos/(.+)/preview\.m3u8$ header https://hm-img.xuezhumall.com/videos/$1/index.m3u8
 ^https://hm-img\.xuezhumall\.com/videos/(.+)/preview\.m3u8$ url 302 https://hm-img.xuezhumall.com/videos/$1/index.m3u8

 [Script]
 # 会员
 http-response ^https://sm-api\.xuezhumall\.com/api/users/profile\?* script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/65kan.js, requires-body=true, timeout=60, tag=会员
 # 视频
 http-response ^https:\/\/[a-z0-9\-]+(?:\.[a-z0-9\-]+)*\.xyz(?::\d+)?\/video-details\/\d+(?:\?.*)?$ script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/65kan.js, requires-body=true, timeout=60, tag=视频
 # 广告
 http-response ^https://sm-api\.xuezhumall\.com/api/common_ads\?* script-path=https://raw.githubusercontent.com/chmg2025/script/refs/heads/main/65kan.js, requires-body=true, timeout=60, tag=广告


 [MITM]
 hostname = *.xuezhumall.com, *.xyz
 ***********************************/

let $ = new Env('65看片')

let body = $response.body
let url = $request.url
const CryptoJS = createCryptoJS();
let key = {
    "words": [
        2062954695,
        -529740081,
        -1492297208,
        1595448326
    ],
    "sigBytes": 16
}
if (url.indexOf('/video-details/') !== -1){
    let r = /window\.CONFIG\s*=\s*['"]([^'"]+)['"]/
    let o = body.match(r)
    let json = JSON.parse(decryptAES_CBC(o[1]))
    json.site.is_video_ads = 0
    json.site.paid_movie_trial_time = 9999
    delete json.site.ad_tj
    let CONFIG = encryptAES_CBC(JSON.stringify(json))
    body = body.replace(/window\.CONFIG\s*=\s*['"]([^'"]+)['"]/, "window.CONFIG = '"  + CONFIG + "'")
    $.done({body : body})
}

if (url.indexOf('/api/common_ads') !== -1) {
    let data = JSON.parse(body)
    let json = JSON.parse(decryptAES_CBC(data["x-data"]))
    delete json.data.items
    data["x-data"] = encryptAES_CBC(JSON.stringify(json))
    $.done({body :JSON.stringify(data)})
}
if (url.indexOf('/api/users/profile') !== -1){
    let data = JSON.parse(body)
    let json = JSON.parse(decryptAES_CBC(data["x-data"]))
    json.data.user.name = '小白解锁'
    json.data.user.username = '小白解锁'
    json.data.user.vip_type = 5
    json.data.user.vip_deadline = '2099-12-01T00:00:00'
    json.data.user.forbidden_vip_deadline = '2099-12-01T00:00:00'
    json.data.user.webtoon_vip_deadline = '2099-12-01T00:00:00'
    json.data.user.novle_vip_deadline = '2099-12-01T00:00:00'
    json.data.user.perfect_vip_deadline = '2099-12-01T00:00:00'
    json.data.user.forbidden_vip_type = 5
    json.data.user.webtoon_vip_type = 5
    json.data.user.novle_vip_type = 5
    json.data.user.perfect_vip_type = 5
    json.data.user.vip_days = 1000
    data["x-data"] = encryptAES_CBC(JSON.stringify(json))
    $.done({body :JSON.stringify(data)})
}



function decryptAES_CBC(data) {
    function decode(t) {
    return t = (t += Array(5 - t.length % 4).join("=")).replace(/\-/g, "+").replace(/\_/g, "/")
}
    let text = CryptoJS.enc.Base64.parse(decode(data.replace(/=+$/, ""))).toString(CryptoJS.enc.Hex)
    let s = text.length - 64;
    let cipherTextHex = text.slice(50, s)
    let cipherText = CryptoJS.enc.Hex.parse(cipherTextHex)
    let base64String = CryptoJS.enc.Base64.stringify(cipherText);
    let ivHex = text.slice(18, 50)
    let iv = CryptoJS.enc.Hex.parse(ivHex)
    const decrypted = CryptoJS.AES.decrypt(base64String, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8)
}
function encryptAES_CBC(data) {
    // 将数据转换为JSON字符串（如果是对象）
    const jsonString = typeof data === 'object' ? JSON.stringify(data) : data;

    // 生成随机IV
    const iv = CryptoJS.lib.WordArray.random(16);

    // 使用AES-CBC模式加密数据
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC
    });

    // 获取加密后的Base64字符串
    const base64String = encrypted.toString();

    // 将Base64转换为十六进制
    const cipherTextHex = CryptoJS.enc.Base64.parse(base64String).toString(CryptoJS.enc.Hex);

    // 生成固定长度的前缀和后缀
    // 解密代码中: text.slice(18, 50) 获取IV, text.slice(50, s) 获取密文
    // 所以前缀长度应该是18字节(36个十六进制字符)
    // 后缀长度应该是64字节(128个十六进制字符)
    const prefix = CryptoJS.lib.WordArray.random(9).toString(CryptoJS.enc.Hex); // 18字节 = 9个WordArray元素
    const suffix = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex); // 64字节 = 32个WordArray元素

    // 获取IV的十六进制表示
    const ivHex = iv.toString(CryptoJS.enc.Hex);

    // 组合所有部分
    const combinedHex = prefix + ivHex + cipherTextHex + suffix;

    // 将十六进制转换为Base64
    const base64Result = CryptoJS.enc.Hex.parse(combinedHex).toString(CryptoJS.enc.Base64);

    // 进行URL安全编码 - 与解密代码中的decode函数相反
    return base64Result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
//Crypto-JS库
function createCryptoJS() {
    var t, e, r, i, n, o, s, a, c = c || function (t, e) {
        var r;
        if ("undefined" != typeof window && window.crypto && (r = window.crypto),
        "undefined" != typeof self && self.crypto && (r = self.crypto),
        "undefined" != typeof globalThis && globalThis.crypto && (r = globalThis.crypto),
        !r && "undefined" != typeof window && window.msCrypto && (r = window.msCrypto),
        !r && "undefined" != typeof global && global.crypto && (r = global.crypto),
        !r && "function" == typeof require)
            try {
                r = require("crypto")
            } catch (t) {
            }
        var i = function () {
            if (r) {
                if ("function" == typeof r.getRandomValues)
                    try {
                        return r.getRandomValues(new Uint32Array(1))[0]
                    } catch (t) {
                    }
                if ("function" == typeof r.randomBytes)
                    try {
                        return r.randomBytes(4).readInt32LE()
                    } catch (t) {
                    }
            }
            throw new Error("Native crypto module could not be used to get secure random number.")
        }
            , n = Object.create || function () {
            function t() {
            }

            return function (e) {
                var r;
                return t.prototype = e,
                    r = new t,
                    t.prototype = null,
                    r
            }
        }()
            , o = {}
            , s = o.lib = {}
            , a = s.Base = {
            extend: function (t) {
                var e = n(this);
                return t && e.mixIn(t),
                e.hasOwnProperty("init") && this.init !== e.init || (e.init = function () {
                        e.$super.init.apply(this, arguments)
                    }
                ),
                    e.init.prototype = e,
                    e.$super = this,
                    e
            },
            create: function () {
                var t = this.extend();
                return t.init.apply(t, arguments),
                    t
            },
            init: function () {
            },
            mixIn: function (t) {
                for (var e in t)
                    t.hasOwnProperty(e) && (this[e] = t[e]);
                t.hasOwnProperty("toString") && (this.toString = t.toString)
            },
            clone: function () {
                return this.init.prototype.extend(this)
            }
        }
            , c = s.WordArray = a.extend({
            init: function (t, e) {
                t = this.words = t || [],
                    this.sigBytes = null != e ? e : 4 * t.length
            },
            toString: function (t) {
                return (t || l).stringify(this)
            },
            concat: function (t) {
                var e = this.words
                    , r = t.words
                    , i = this.sigBytes
                    , n = t.sigBytes;
                if (this.clamp(),
                i % 4)
                    for (var o = 0; o < n; o++) {
                        var s = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                        e[i + o >>> 2] |= s << 24 - (i + o) % 4 * 8
                    }
                else
                    for (var a = 0; a < n; a += 4)
                        e[i + a >>> 2] = r[a >>> 2];
                return this.sigBytes += n,
                    this
            },
            clamp: function () {
                var e = this.words
                    , r = this.sigBytes;
                e[r >>> 2] &= 4294967295 << 32 - r % 4 * 8,
                    e.length = t.ceil(r / 4)
            },
            clone: function () {
                var t = a.clone.call(this);
                return t.words = this.words.slice(0),
                    t
            },
            random: function (t) {
                for (var e = [], r = 0; r < t; r += 4)
                    e.push(i());
                return new c.init(e, t)
            }
        })
            , h = o.enc = {}
            , l = h.Hex = {
            stringify: function (t) {
                for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n++) {
                    var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                    i.push((o >>> 4).toString(16)),
                        i.push((15 & o).toString(16))
                }
                return i.join("")
            },
            parse: function (t) {
                for (var e = t.length, r = [], i = 0; i < e; i += 2)
                    r[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4;
                return new c.init(r, e / 2)
            }
        }
            , f = h.Latin1 = {
            stringify: function (t) {
                for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n++) {
                    var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                    i.push(String.fromCharCode(o))
                }
                return i.join("")
            },
            parse: function (t) {
                for (var e = t.length, r = [], i = 0; i < e; i++)
                    r[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8;
                return new c.init(r, e)
            }
        }
            , u = h.Utf8 = {
            stringify: function (t) {
                try {
                    return decodeURIComponent(escape(f.stringify(t)))
                } catch (t) {
                    throw new Error("Malformed UTF-8 data")
                }
            },
            parse: function (t) {
                return f.parse(unescape(encodeURIComponent(t)))
            }
        }
            , d = s.BufferedBlockAlgorithm = a.extend({
            reset: function () {
                this._data = new c.init,
                    this._nDataBytes = 0
            },
            _append: function (t) {
                "string" == typeof t && (t = u.parse(t)),
                    this._data.concat(t),
                    this._nDataBytes += t.sigBytes
            },
            _process: function (e) {
                var r, i = this._data, n = i.words, o = i.sigBytes, s = this.blockSize, a = o / (4 * s),
                    h = (a = e ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0)) * s, l = t.min(4 * h, o);
                if (h) {
                    for (var f = 0; f < h; f += s)
                        this._doProcessBlock(n, f);
                    r = n.splice(0, h),
                        i.sigBytes -= l
                }
                return new c.init(r, l)
            },
            clone: function () {
                var t = a.clone.call(this);
                return t._data = this._data.clone(),
                    t
            },
            _minBufferSize: 0
        })
            , p = (s.Hasher = d.extend({
            cfg: a.extend(),
            init: function (t) {
                this.cfg = this.cfg.extend(t),
                    this.reset()
            },
            reset: function () {
                d.reset.call(this),
                    this._doReset()
            },
            update: function (t) {
                return this._append(t),
                    this._process(),
                    this
            },
            finalize: function (t) {
                return t && this._append(t),
                    this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function (t) {
                return function (e, r) {
                    return new t.init(r).finalize(e)
                }
            },
            _createHmacHelper: function (t) {
                return function (e, r) {
                    return new p.HMAC.init(t, r).finalize(e)
                }
            }
        }),
            o.algo = {});
        return o
    }(Math);
    return e = (t = c).lib,
        r = e.Base,
        i = e.WordArray,
        (n = t.x64 = {}).Word = r.extend({
            init: function (t, e) {
                this.high = t,
                    this.low = e
            }
        }),
        n.WordArray = r.extend({
            init: function (t, e) {
                t = this.words = t || [],
                    this.sigBytes = null != e ? e : 8 * t.length
            },
            toX32: function () {
                for (var t = this.words, e = t.length, r = [], n = 0; n < e; n++) {
                    var o = t[n];
                    r.push(o.high),
                        r.push(o.low)
                }
                return i.create(r, this.sigBytes)
            },
            clone: function () {
                for (var t = r.clone.call(this), e = t.words = this.words.slice(0), i = e.length, n = 0; n < i; n++)
                    e[n] = e[n].clone();
                return t
            }
        }),
        function () {
            if ("function" == typeof ArrayBuffer) {
                var t = c.lib.WordArray
                    , e = t.init
                    , r = t.init = function (t) {
                        if (t instanceof ArrayBuffer && (t = new Uint8Array(t)),
                        (t instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array) && (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength)),
                        t instanceof Uint8Array) {
                            for (var r = t.byteLength, i = [], n = 0; n < r; n++)
                                i[n >>> 2] |= t[n] << 24 - n % 4 * 8;
                            e.call(this, i, r)
                        } else
                            e.apply(this, arguments)
                    }
                ;
                r.prototype = t
            }
        }(),
        function () {
            var t = c
                , e = t.lib.WordArray
                , r = t.enc;
            r.Utf16 = r.Utf16BE = {
                stringify: function (t) {
                    for (var e = t.words, r = t.sigBytes, i = [], n = 0; n < r; n += 2) {
                        var o = e[n >>> 2] >>> 16 - n % 4 * 8 & 65535;
                        i.push(String.fromCharCode(o))
                    }
                    return i.join("")
                },
                parse: function (t) {
                    for (var r = t.length, i = [], n = 0; n < r; n++)
                        i[n >>> 1] |= t.charCodeAt(n) << 16 - n % 2 * 16;
                    return e.create(i, 2 * r)
                }
            };

            function i(t) {
                return t << 8 & 4278255360 | t >>> 8 & 16711935
            }

            r.Utf16LE = {
                stringify: function (t) {
                    for (var e = t.words, r = t.sigBytes, n = [], o = 0; o < r; o += 2) {
                        var s = i(e[o >>> 2] >>> 16 - o % 4 * 8 & 65535);
                        n.push(String.fromCharCode(s))
                    }
                    return n.join("")
                },
                parse: function (t) {
                    for (var r = t.length, n = [], o = 0; o < r; o++)
                        n[o >>> 1] |= i(t.charCodeAt(o) << 16 - o % 2 * 16);
                    return e.create(n, 2 * r)
                }
            }
        }(),
        function () {
            var t = c
                , e = t.lib.WordArray;
            t.enc.Base64 = {
                stringify: function (t) {
                    var e = t.words
                        , r = t.sigBytes
                        , i = this._map;
                    t.clamp();
                    for (var n = [], o = 0; o < r; o += 3)
                        for (var s = (e[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (e[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | e[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, a = 0; a < 4 && o + .75 * a < r; a++)
                            n.push(i.charAt(s >>> 6 * (3 - a) & 63));
                    var c = i.charAt(64);
                    if (c)
                        for (; n.length % 4;)
                            n.push(c);
                    return n.join("")
                },
                parse: function (t) {
                    var r = t.length
                        , i = this._map
                        , n = this._reverseMap;
                    if (!n) {
                        n = this._reverseMap = [];
                        for (var o = 0; o < i.length; o++)
                            n[i.charCodeAt(o)] = o
                    }
                    var s = i.charAt(64);
                    if (s) {
                        var a = t.indexOf(s);
                        -1 !== a && (r = a)
                    }
                    return function (t, r, i) {
                        for (var n = [], o = 0, s = 0; s < r; s++)
                            if (s % 4) {
                                var a = i[t.charCodeAt(s - 1)] << s % 4 * 2 | i[t.charCodeAt(s)] >>> 6 - s % 4 * 2;
                                n[o >>> 2] |= a << 24 - o % 4 * 8,
                                    o++
                            }
                        return e.create(n, o)
                    }(t, r, n)
                },
                _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            }
        }(),
        function () {
            var t = c
                , e = t.lib.WordArray;
            t.enc.Base64url = {
                stringify: function (t, e) {
                    void 0 === e && (e = !0);
                    var r = t.words
                        , i = t.sigBytes
                        , n = e ? this._safe_map : this._map;
                    t.clamp();
                    for (var o = [], s = 0; s < i; s += 3)
                        for (var a = (r[s >>> 2] >>> 24 - s % 4 * 8 & 255) << 16 | (r[s + 1 >>> 2] >>> 24 - (s + 1) % 4 * 8 & 255) << 8 | r[s + 2 >>> 2] >>> 24 - (s + 2) % 4 * 8 & 255, c = 0; c < 4 && s + .75 * c < i; c++)
                            o.push(n.charAt(a >>> 6 * (3 - c) & 63));
                    var h = n.charAt(64);
                    if (h)
                        for (; o.length % 4;)
                            o.push(h);
                    return o.join("")
                },
                parse: function (t, r) {
                    void 0 === r && (r = !0);
                    var i = t.length
                        , n = r ? this._safe_map : this._map
                        , o = this._reverseMap;
                    if (!o) {
                        o = this._reverseMap = [];
                        for (var s = 0; s < n.length; s++)
                            o[n.charCodeAt(s)] = s
                    }
                    var a = n.charAt(64);
                    if (a) {
                        var c = t.indexOf(a);
                        -1 !== c && (i = c)
                    }
                    return function (t, r, i) {
                        for (var n = [], o = 0, s = 0; s < r; s++)
                            if (s % 4) {
                                var a = i[t.charCodeAt(s - 1)] << s % 4 * 2 | i[t.charCodeAt(s)] >>> 6 - s % 4 * 2;
                                n[o >>> 2] |= a << 24 - o % 4 * 8,
                                    o++
                            }
                        return e.create(n, o)
                    }(t, i, o)
                },
                _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
            }
        }(),
        function (t) {
            var e = c
                , r = e.lib
                , i = r.WordArray
                , n = r.Hasher
                , o = e.algo
                , s = [];
            !function () {
                for (var e = 0; e < 64; e++)
                    s[e] = 4294967296 * t.abs(t.sin(e + 1)) | 0
            }();
            var a = o.MD5 = n.extend({
                _doReset: function () {
                    this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878])
                },
                _doProcessBlock: function (t, e) {
                    for (var r = 0; r < 16; r++) {
                        var i = e + r
                            , n = t[i];
                        t[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
                    }
                    var o = this._hash.words
                        , a = t[e + 0]
                        , c = t[e + 1]
                        , d = t[e + 2]
                        , p = t[e + 3]
                        , _ = t[e + 4]
                        , v = t[e + 5]
                        , y = t[e + 6]
                        , g = t[e + 7]
                        , B = t[e + 8]
                        , w = t[e + 9]
                        , k = t[e + 10]
                        , b = t[e + 11]
                        , x = t[e + 12]
                        , S = t[e + 13]
                        , m = t[e + 14]
                        , A = t[e + 15]
                        , z = o[0]
                        , H = o[1]
                        , C = o[2]
                        , R = o[3];
                    z = h(z, H, C, R, a, 7, s[0]),
                        R = h(R, z, H, C, c, 12, s[1]),
                        C = h(C, R, z, H, d, 17, s[2]),
                        H = h(H, C, R, z, p, 22, s[3]),
                        z = h(z, H, C, R, _, 7, s[4]),
                        R = h(R, z, H, C, v, 12, s[5]),
                        C = h(C, R, z, H, y, 17, s[6]),
                        H = h(H, C, R, z, g, 22, s[7]),
                        z = h(z, H, C, R, B, 7, s[8]),
                        R = h(R, z, H, C, w, 12, s[9]),
                        C = h(C, R, z, H, k, 17, s[10]),
                        H = h(H, C, R, z, b, 22, s[11]),
                        z = h(z, H, C, R, x, 7, s[12]),
                        R = h(R, z, H, C, S, 12, s[13]),
                        C = h(C, R, z, H, m, 17, s[14]),
                        z = l(z, H = h(H, C, R, z, A, 22, s[15]), C, R, c, 5, s[16]),
                        R = l(R, z, H, C, y, 9, s[17]),
                        C = l(C, R, z, H, b, 14, s[18]),
                        H = l(H, C, R, z, a, 20, s[19]),
                        z = l(z, H, C, R, v, 5, s[20]),
                        R = l(R, z, H, C, k, 9, s[21]),
                        C = l(C, R, z, H, A, 14, s[22]),
                        H = l(H, C, R, z, _, 20, s[23]),
                        z = l(z, H, C, R, w, 5, s[24]),
                        R = l(R, z, H, C, m, 9, s[25]),
                        C = l(C, R, z, H, p, 14, s[26]),
                        H = l(H, C, R, z, B, 20, s[27]),
                        z = l(z, H, C, R, S, 5, s[28]),
                        R = l(R, z, H, C, d, 9, s[29]),
                        C = l(C, R, z, H, g, 14, s[30]),
                        z = f(z, H = l(H, C, R, z, x, 20, s[31]), C, R, v, 4, s[32]),
                        R = f(R, z, H, C, B, 11, s[33]),
                        C = f(C, R, z, H, b, 16, s[34]),
                        H = f(H, C, R, z, m, 23, s[35]),
                        z = f(z, H, C, R, c, 4, s[36]),
                        R = f(R, z, H, C, _, 11, s[37]),
                        C = f(C, R, z, H, g, 16, s[38]),
                        H = f(H, C, R, z, k, 23, s[39]),
                        z = f(z, H, C, R, S, 4, s[40]),
                        R = f(R, z, H, C, a, 11, s[41]),
                        C = f(C, R, z, H, p, 16, s[42]),
                        H = f(H, C, R, z, y, 23, s[43]),
                        z = f(z, H, C, R, w, 4, s[44]),
                        R = f(R, z, H, C, x, 11, s[45]),
                        C = f(C, R, z, H, A, 16, s[46]),
                        z = u(z, H = f(H, C, R, z, d, 23, s[47]), C, R, a, 6, s[48]),
                        R = u(R, z, H, C, g, 10, s[49]),
                        C = u(C, R, z, H, m, 15, s[50]),
                        H = u(H, C, R, z, v, 21, s[51]),
                        z = u(z, H, C, R, x, 6, s[52]),
                        R = u(R, z, H, C, p, 10, s[53]),
                        C = u(C, R, z, H, k, 15, s[54]),
                        H = u(H, C, R, z, c, 21, s[55]),
                        z = u(z, H, C, R, B, 6, s[56]),
                        R = u(R, z, H, C, A, 10, s[57]),
                        C = u(C, R, z, H, y, 15, s[58]),
                        H = u(H, C, R, z, S, 21, s[59]),
                        z = u(z, H, C, R, _, 6, s[60]),
                        R = u(R, z, H, C, b, 10, s[61]),
                        C = u(C, R, z, H, d, 15, s[62]),
                        H = u(H, C, R, z, w, 21, s[63]),
                        o[0] = o[0] + z | 0,
                        o[1] = o[1] + H | 0,
                        o[2] = o[2] + C | 0,
                        o[3] = o[3] + R | 0
                },
                _doFinalize: function () {
                    var e = this._data
                        , r = e.words
                        , i = 8 * this._nDataBytes
                        , n = 8 * e.sigBytes;
                    r[n >>> 5] |= 128 << 24 - n % 32;
                    var o = t.floor(i / 4294967296)
                        , s = i;
                    r[15 + (n + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                        r[14 + (n + 64 >>> 9 << 4)] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                        e.sigBytes = 4 * (r.length + 1),
                        this._process();
                    for (var a = this._hash, c = a.words, h = 0; h < 4; h++) {
                        var l = c[h];
                        c[h] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8)
                    }
                    return a
                },
                clone: function () {
                    var t = n.clone.call(this);
                    return t._hash = this._hash.clone(),
                        t
                }
            });

            function h(t, e, r, i, n, o, s) {
                var a = t + (e & r | ~e & i) + n + s;
                return (a << o | a >>> 32 - o) + e
            }

            function l(t, e, r, i, n, o, s) {
                var a = t + (e & i | r & ~i) + n + s;
                return (a << o | a >>> 32 - o) + e
            }

            function f(t, e, r, i, n, o, s) {
                var a = t + (e ^ r ^ i) + n + s;
                return (a << o | a >>> 32 - o) + e
            }

            function u(t, e, r, i, n, o, s) {
                var a = t + (r ^ (e | ~i)) + n + s;
                return (a << o | a >>> 32 - o) + e
            }

            e.MD5 = n._createHelper(a),
                e.HmacMD5 = n._createHmacHelper(a)
        }(Math),
        function () {
            var t = c
                , e = t.lib
                , r = e.WordArray
                , i = e.Hasher
                , n = t.algo
                , o = []
                , s = n.SHA1 = i.extend({
                _doReset: function () {
                    this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                },
                _doProcessBlock: function (t, e) {
                    for (var r = this._hash.words, i = r[0], n = r[1], s = r[2], a = r[3], c = r[4], h = 0; h < 80; h++) {
                        if (h < 16)
                            o[h] = 0 | t[e + h];
                        else {
                            var l = o[h - 3] ^ o[h - 8] ^ o[h - 14] ^ o[h - 16];
                            o[h] = l << 1 | l >>> 31
                        }
                        var f = (i << 5 | i >>> 27) + c + o[h];
                        f += h < 20 ? 1518500249 + (n & s | ~n & a) : h < 40 ? 1859775393 + (n ^ s ^ a) : h < 60 ? (n & s | n & a | s & a) - 1894007588 : (n ^ s ^ a) - 899497514,
                            c = a,
                            a = s,
                            s = n << 30 | n >>> 2,
                            n = i,
                            i = f
                    }
                    r[0] = r[0] + i | 0,
                        r[1] = r[1] + n | 0,
                        r[2] = r[2] + s | 0,
                        r[3] = r[3] + a | 0,
                        r[4] = r[4] + c | 0
                },
                _doFinalize: function () {
                    var t = this._data
                        , e = t.words
                        , r = 8 * this._nDataBytes
                        , i = 8 * t.sigBytes;
                    return e[i >>> 5] |= 128 << 24 - i % 32,
                        e[14 + (i + 64 >>> 9 << 4)] = Math.floor(r / 4294967296),
                        e[15 + (i + 64 >>> 9 << 4)] = r,
                        t.sigBytes = 4 * e.length,
                        this._process(),
                        this._hash
                },
                clone: function () {
                    var t = i.clone.call(this);
                    return t._hash = this._hash.clone(),
                        t
                }
            });
            t.SHA1 = i._createHelper(s),
                t.HmacSHA1 = i._createHmacHelper(s)
        }(),
        function (t) {
            var e = c
                , r = e.lib
                , i = r.WordArray
                , n = r.Hasher
                , o = e.algo
                , s = []
                , a = [];
            !function () {
                function e(e) {
                    for (var r = t.sqrt(e), i = 2; i <= r; i++)
                        if (!(e % i))
                            return !1;
                    return !0
                }

                function r(t) {
                    return 4294967296 * (t - (0 | t)) | 0
                }

                for (var i = 2, n = 0; n < 64;)
                    e(i) && (n < 8 && (s[n] = r(t.pow(i, .5))),
                        a[n] = r(t.pow(i, 1 / 3)),
                        n++),
                        i++
            }();
            var h = []
                , l = o.SHA256 = n.extend({
                _doReset: function () {
                    this._hash = new i.init(s.slice(0))
                },
                _doProcessBlock: function (t, e) {
                    for (var r = this._hash.words, i = r[0], n = r[1], o = r[2], s = r[3], c = r[4], l = r[5], f = r[6], u = r[7], d = 0; d < 64; d++) {
                        if (d < 16)
                            h[d] = 0 | t[e + d];
                        else {
                            var p = h[d - 15]
                                , _ = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3
                                , v = h[d - 2]
                                , y = (v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10;
                            h[d] = _ + h[d - 7] + y + h[d - 16]
                        }
                        var g = i & n ^ i & o ^ n & o
                            , B = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22)
                            ,
                            w = u + ((c << 26 | c >>> 6) ^ (c << 21 | c >>> 11) ^ (c << 7 | c >>> 25)) + (c & l ^ ~c & f) + a[d] + h[d];
                        u = f,
                            f = l,
                            l = c,
                            c = s + w | 0,
                            s = o,
                            o = n,
                            n = i,
                            i = w + (B + g) | 0
                    }
                    r[0] = r[0] + i | 0,
                        r[1] = r[1] + n | 0,
                        r[2] = r[2] + o | 0,
                        r[3] = r[3] + s | 0,
                        r[4] = r[4] + c | 0,
                        r[5] = r[5] + l | 0,
                        r[6] = r[6] + f | 0,
                        r[7] = r[7] + u | 0
                },
                _doFinalize: function () {
                    var e = this._data
                        , r = e.words
                        , i = 8 * this._nDataBytes
                        , n = 8 * e.sigBytes;
                    return r[n >>> 5] |= 128 << 24 - n % 32,
                        r[14 + (n + 64 >>> 9 << 4)] = t.floor(i / 4294967296),
                        r[15 + (n + 64 >>> 9 << 4)] = i,
                        e.sigBytes = 4 * r.length,
                        this._process(),
                        this._hash
                },
                clone: function () {
                    var t = n.clone.call(this);
                    return t._hash = this._hash.clone(),
                        t
                }
            });
            e.SHA256 = n._createHelper(l),
                e.HmacSHA256 = n._createHmacHelper(l)
        }(Math),
        function () {
            var t = c
                , e = t.lib.WordArray
                , r = t.algo
                , i = r.SHA256
                , n = r.SHA224 = i.extend({
                _doReset: function () {
                    this._hash = new e.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
                },
                _doFinalize: function () {
                    var t = i._doFinalize.call(this);
                    return t.sigBytes -= 4,
                        t
                }
            });
            t.SHA224 = i._createHelper(n),
                t.HmacSHA224 = i._createHmacHelper(n)
        }(),
        function () {
            var t = c
                , e = t.lib.Hasher
                , r = t.x64
                , i = r.Word
                , n = r.WordArray
                , o = t.algo;

            function s() {
                return i.create.apply(i, arguments)
            }

            var a = [s(1116352408, 3609767458), s(1899447441, 602891725), s(3049323471, 3964484399), s(3921009573, 2173295548), s(961987163, 4081628472), s(1508970993, 3053834265), s(2453635748, 2937671579), s(2870763221, 3664609560), s(3624381080, 2734883394), s(310598401, 1164996542), s(607225278, 1323610764), s(1426881987, 3590304994), s(1925078388, 4068182383), s(2162078206, 991336113), s(2614888103, 633803317), s(3248222580, 3479774868), s(3835390401, 2666613458), s(4022224774, 944711139), s(264347078, 2341262773), s(604807628, 2007800933), s(770255983, 1495990901), s(1249150122, 1856431235), s(1555081692, 3175218132), s(1996064986, 2198950837), s(2554220882, 3999719339), s(2821834349, 766784016), s(2952996808, 2566594879), s(3210313671, 3203337956), s(3336571891, 1034457026), s(3584528711, 2466948901), s(113926993, 3758326383), s(338241895, 168717936), s(666307205, 1188179964), s(773529912, 1546045734), s(1294757372, 1522805485), s(1396182291, 2643833823), s(1695183700, 2343527390), s(1986661051, 1014477480), s(2177026350, 1206759142), s(2456956037, 344077627), s(2730485921, 1290863460), s(2820302411, 3158454273), s(3259730800, 3505952657), s(3345764771, 106217008), s(3516065817, 3606008344), s(3600352804, 1432725776), s(4094571909, 1467031594), s(275423344, 851169720), s(430227734, 3100823752), s(506948616, 1363258195), s(659060556, 3750685593), s(883997877, 3785050280), s(958139571, 3318307427), s(1322822218, 3812723403), s(1537002063, 2003034995), s(1747873779, 3602036899), s(1955562222, 1575990012), s(2024104815, 1125592928), s(2227730452, 2716904306), s(2361852424, 442776044), s(2428436474, 593698344), s(2756734187, 3733110249), s(3204031479, 2999351573), s(3329325298, 3815920427), s(3391569614, 3928383900), s(3515267271, 566280711), s(3940187606, 3454069534), s(4118630271, 4000239992), s(116418474, 1914138554), s(174292421, 2731055270), s(289380356, 3203993006), s(460393269, 320620315), s(685471733, 587496836), s(852142971, 1086792851), s(1017036298, 365543100), s(1126000580, 2618297676), s(1288033470, 3409855158), s(1501505948, 4234509866), s(1607167915, 987167468), s(1816402316, 1246189591)]
                , h = [];
            !function () {
                for (var t = 0; t < 80; t++)
                    h[t] = s()
            }();
            var l = o.SHA512 = e.extend({
                _doReset: function () {
                    this._hash = new n.init([new i.init(1779033703, 4089235720), new i.init(3144134277, 2227873595), new i.init(1013904242, 4271175723), new i.init(2773480762, 1595750129), new i.init(1359893119, 2917565137), new i.init(2600822924, 725511199), new i.init(528734635, 4215389547), new i.init(1541459225, 327033209)])
                },
                _doProcessBlock: function (t, e) {
                    for (var r = this._hash.words, i = r[0], n = r[1], o = r[2], s = r[3], c = r[4], l = r[5], f = r[6], u = r[7], d = i.high, p = i.low, _ = n.high, v = n.low, y = o.high, g = o.low, B = s.high, w = s.low, k = c.high, b = c.low, x = l.high, S = l.low, m = f.high, A = f.low, z = u.high, H = u.low, C = d, R = p, D = _, E = v, M = y, P = g, F = B, W = w, O = k, I = b, U = x, K = S, X = m, L = A, j = z, T = H, N = 0; N < 80; N++) {
                        var q, Z, V = h[N];
                        if (N < 16)
                            Z = V.high = 0 | t[e + 2 * N],
                                q = V.low = 0 | t[e + 2 * N + 1];
                        else {
                            var G = h[N - 15]
                                , J = G.high
                                , Q = G.low
                                , Y = (J >>> 1 | Q << 31) ^ (J >>> 8 | Q << 24) ^ J >>> 7
                                , $ = (Q >>> 1 | J << 31) ^ (Q >>> 8 | J << 24) ^ (Q >>> 7 | J << 25)
                                , tt = h[N - 2]
                                , et = tt.high
                                , rt = tt.low
                                , it = (et >>> 19 | rt << 13) ^ (et << 3 | rt >>> 29) ^ et >>> 6
                                , nt = (rt >>> 19 | et << 13) ^ (rt << 3 | et >>> 29) ^ (rt >>> 6 | et << 26)
                                , ot = h[N - 7]
                                , st = ot.high
                                , at = ot.low
                                , ct = h[N - 16]
                                , ht = ct.high
                                , lt = ct.low;
                            Z = (Z = (Z = Y + st + ((q = $ + at) >>> 0 < $ >>> 0 ? 1 : 0)) + it + ((q += nt) >>> 0 < nt >>> 0 ? 1 : 0)) + ht + ((q += lt) >>> 0 < lt >>> 0 ? 1 : 0),
                                V.high = Z,
                                V.low = q
                        }
                        var ft, ut = O & U ^ ~O & X, dt = I & K ^ ~I & L, pt = C & D ^ C & M ^ D & M,
                            _t = R & E ^ R & P ^ E & P,
                            vt = (C >>> 28 | R << 4) ^ (C << 30 | R >>> 2) ^ (C << 25 | R >>> 7),
                            yt = (R >>> 28 | C << 4) ^ (R << 30 | C >>> 2) ^ (R << 25 | C >>> 7),
                            gt = (O >>> 14 | I << 18) ^ (O >>> 18 | I << 14) ^ (O << 23 | I >>> 9),
                            Bt = (I >>> 14 | O << 18) ^ (I >>> 18 | O << 14) ^ (I << 23 | O >>> 9), wt = a[N],
                            kt = wt.high, bt = wt.low, xt = j + gt + ((ft = T + Bt) >>> 0 < T >>> 0 ? 1 : 0),
                            St = yt + _t;
                        j = X,
                            T = L,
                            X = U,
                            L = K,
                            U = O,
                            K = I,
                            O = F + (xt = (xt = (xt = xt + ut + ((ft = ft + dt) >>> 0 < dt >>> 0 ? 1 : 0)) + kt + ((ft = ft + bt) >>> 0 < bt >>> 0 ? 1 : 0)) + Z + ((ft = ft + q) >>> 0 < q >>> 0 ? 1 : 0)) + ((I = W + ft | 0) >>> 0 < W >>> 0 ? 1 : 0) | 0,
                            F = M,
                            W = P,
                            M = D,
                            P = E,
                            D = C,
                            E = R,
                            C = xt + (vt + pt + (St >>> 0 < yt >>> 0 ? 1 : 0)) + ((R = ft + St | 0) >>> 0 < ft >>> 0 ? 1 : 0) | 0
                    }
                    p = i.low = p + R,
                        i.high = d + C + (p >>> 0 < R >>> 0 ? 1 : 0),
                        v = n.low = v + E,
                        n.high = _ + D + (v >>> 0 < E >>> 0 ? 1 : 0),
                        g = o.low = g + P,
                        o.high = y + M + (g >>> 0 < P >>> 0 ? 1 : 0),
                        w = s.low = w + W,
                        s.high = B + F + (w >>> 0 < W >>> 0 ? 1 : 0),
                        b = c.low = b + I,
                        c.high = k + O + (b >>> 0 < I >>> 0 ? 1 : 0),
                        S = l.low = S + K,
                        l.high = x + U + (S >>> 0 < K >>> 0 ? 1 : 0),
                        A = f.low = A + L,
                        f.high = m + X + (A >>> 0 < L >>> 0 ? 1 : 0),
                        H = u.low = H + T,
                        u.high = z + j + (H >>> 0 < T >>> 0 ? 1 : 0)
                },
                _doFinalize: function () {
                    var t = this._data
                        , e = t.words
                        , r = 8 * this._nDataBytes
                        , i = 8 * t.sigBytes;
                    return e[i >>> 5] |= 128 << 24 - i % 32,
                        e[30 + (i + 128 >>> 10 << 5)] = Math.floor(r / 4294967296),
                        e[31 + (i + 128 >>> 10 << 5)] = r,
                        t.sigBytes = 4 * e.length,
                        this._process(),
                        this._hash.toX32()
                },
                clone: function () {
                    var t = e.clone.call(this);
                    return t._hash = this._hash.clone(),
                        t
                },
                blockSize: 32
            });
            t.SHA512 = e._createHelper(l),
                t.HmacSHA512 = e._createHmacHelper(l)
        }(),
        function () {
            var t = c
                , e = t.x64
                , r = e.Word
                , i = e.WordArray
                , n = t.algo
                , o = n.SHA512
                , s = n.SHA384 = o.extend({
                _doReset: function () {
                    this._hash = new i.init([new r.init(3418070365, 3238371032), new r.init(1654270250, 914150663), new r.init(2438529370, 812702999), new r.init(355462360, 4144912697), new r.init(1731405415, 4290775857), new r.init(2394180231, 1750603025), new r.init(3675008525, 1694076839), new r.init(1203062813, 3204075428)])
                },
                _doFinalize: function () {
                    var t = o._doFinalize.call(this);
                    return t.sigBytes -= 16,
                        t
                }
            });
            t.SHA384 = o._createHelper(s),
                t.HmacSHA384 = o._createHmacHelper(s)
        }(),
        function (t) {
            var e = c
                , r = e.lib
                , i = r.WordArray
                , n = r.Hasher
                , o = e.x64.Word
                , s = e.algo
                , a = []
                , h = []
                , l = [];
            !function () {
                for (var t = 1, e = 0, r = 0; r < 24; r++) {
                    a[t + 5 * e] = (r + 1) * (r + 2) / 2 % 64;
                    var i = (2 * t + 3 * e) % 5;
                    t = e % 5,
                        e = i
                }
                for (t = 0; t < 5; t++)
                    for (e = 0; e < 5; e++)
                        h[t + 5 * e] = e + (2 * t + 3 * e) % 5 * 5;
                for (var n = 1, s = 0; s < 24; s++) {
                    for (var c = 0, f = 0, u = 0; u < 7; u++) {
                        if (1 & n) {
                            var d = (1 << u) - 1;
                            d < 32 ? f ^= 1 << d : c ^= 1 << d - 32
                        }
                        128 & n ? n = n << 1 ^ 113 : n <<= 1
                    }
                    l[s] = o.create(c, f)
                }
            }();
            var f = [];
            !function () {
                for (var t = 0; t < 25; t++)
                    f[t] = o.create()
            }();
            var u = s.SHA3 = n.extend({
                cfg: n.cfg.extend({
                    outputLength: 512
                }),
                _doReset: function () {
                    for (var t = this._state = [], e = 0; e < 25; e++)
                        t[e] = new o.init;
                    this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                },
                _doProcessBlock: function (t, e) {
                    for (var r = this._state, i = this.blockSize / 2, n = 0; n < i; n++) {
                        var o = t[e + 2 * n]
                            , s = t[e + 2 * n + 1];
                        o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                            s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                            (H = r[n]).high ^= s,
                            H.low ^= o
                    }
                    for (var c = 0; c < 24; c++) {
                        for (var u = 0; u < 5; u++) {
                            for (var d = 0, p = 0, _ = 0; _ < 5; _++) {
                                d ^= (H = r[u + 5 * _]).high,
                                    p ^= H.low
                            }
                            var v = f[u];
                            v.high = d,
                                v.low = p
                        }
                        for (u = 0; u < 5; u++) {
                            var y = f[(u + 4) % 5]
                                , g = f[(u + 1) % 5]
                                , B = g.high
                                , w = g.low;
                            for (d = y.high ^ (B << 1 | w >>> 31),
                                     p = y.low ^ (w << 1 | B >>> 31),
                                     _ = 0; _ < 5; _++) {
                                (H = r[u + 5 * _]).high ^= d,
                                    H.low ^= p
                            }
                        }
                        for (var k = 1; k < 25; k++) {
                            var b = (H = r[k]).high
                                , x = H.low
                                , S = a[k];
                            S < 32 ? (d = b << S | x >>> 32 - S,
                                p = x << S | b >>> 32 - S) : (d = x << S - 32 | b >>> 64 - S,
                                p = b << S - 32 | x >>> 64 - S);
                            var m = f[h[k]];
                            m.high = d,
                                m.low = p
                        }
                        var A = f[0]
                            , z = r[0];
                        A.high = z.high,
                            A.low = z.low;
                        for (u = 0; u < 5; u++)
                            for (_ = 0; _ < 5; _++) {
                                var H = r[k = u + 5 * _]
                                    , C = f[k]
                                    , R = f[(u + 1) % 5 + 5 * _]
                                    , D = f[(u + 2) % 5 + 5 * _];
                                H.high = C.high ^ ~R.high & D.high,
                                    H.low = C.low ^ ~R.low & D.low
                            }
                        H = r[0];
                        var E = l[c];
                        H.high ^= E.high,
                            H.low ^= E.low
                    }
                },
                _doFinalize: function () {
                    var e = this._data
                        , r = e.words
                        , n = (this._nDataBytes,
                    8 * e.sigBytes)
                        , o = 32 * this.blockSize;
                    r[n >>> 5] |= 1 << 24 - n % 32,
                        r[(t.ceil((n + 1) / o) * o >>> 5) - 1] |= 128,
                        e.sigBytes = 4 * r.length,
                        this._process();
                    for (var s = this._state, a = this.cfg.outputLength / 8, c = a / 8, h = [], l = 0; l < c; l++) {
                        var f = s[l]
                            , u = f.high
                            , d = f.low;
                        u = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8),
                            d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                            h.push(d),
                            h.push(u)
                    }
                    return new i.init(h, a)
                },
                clone: function () {
                    for (var t = n.clone.call(this), e = t._state = this._state.slice(0), r = 0; r < 25; r++)
                        e[r] = e[r].clone();
                    return t
                }
            });
            e.SHA3 = n._createHelper(u),
                e.HmacSHA3 = n._createHmacHelper(u)
        }(Math),
        function (t) {
            var e = c
                , r = e.lib
                , i = r.WordArray
                , n = r.Hasher
                , o = e.algo
                ,
                s = i.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13])
                ,
                a = i.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11])
                ,
                h = i.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6])
                ,
                l = i.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11])
                , f = i.create([0, 1518500249, 1859775393, 2400959708, 2840853838])
                , u = i.create([1352829926, 1548603684, 1836072691, 2053994217, 0])
                , d = o.RIPEMD160 = n.extend({
                    _doReset: function () {
                        this._hash = i.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                    },
                    _doProcessBlock: function (t, e) {
                        for (var r = 0; r < 16; r++) {
                            var i = e + r
                                , n = t[i];
                            t[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
                        }
                        var o, c, d, w, k, b, x, S, m, A, z, H = this._hash.words, C = f.words, R = u.words, D = s.words,
                            E = a.words, M = h.words, P = l.words;
                        b = o = H[0],
                            x = c = H[1],
                            S = d = H[2],
                            m = w = H[3],
                            A = k = H[4];
                        for (r = 0; r < 80; r += 1)
                            z = o + t[e + D[r]] | 0,
                                z += r < 16 ? p(c, d, w) + C[0] : r < 32 ? _(c, d, w) + C[1] : r < 48 ? v(c, d, w) + C[2] : r < 64 ? y(c, d, w) + C[3] : g(c, d, w) + C[4],
                                z = (z = B(z |= 0, M[r])) + k | 0,
                                o = k,
                                k = w,
                                w = B(d, 10),
                                d = c,
                                c = z,
                                z = b + t[e + E[r]] | 0,
                                z += r < 16 ? g(x, S, m) + R[0] : r < 32 ? y(x, S, m) + R[1] : r < 48 ? v(x, S, m) + R[2] : r < 64 ? _(x, S, m) + R[3] : p(x, S, m) + R[4],
                                z = (z = B(z |= 0, P[r])) + A | 0,
                                b = A,
                                A = m,
                                m = B(S, 10),
                                S = x,
                                x = z;
                        z = H[1] + d + m | 0,
                            H[1] = H[2] + w + A | 0,
                            H[2] = H[3] + k + b | 0,
                            H[3] = H[4] + o + x | 0,
                            H[4] = H[0] + c + S | 0,
                            H[0] = z
                    },
                    _doFinalize: function () {
                        var t = this._data
                            , e = t.words
                            , r = 8 * this._nDataBytes
                            , i = 8 * t.sigBytes;
                        e[i >>> 5] |= 128 << 24 - i % 32,
                            e[14 + (i + 64 >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8),
                            t.sigBytes = 4 * (e.length + 1),
                            this._process();
                        for (var n = this._hash, o = n.words, s = 0; s < 5; s++) {
                            var a = o[s];
                            o[s] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                        }
                        return n
                    },
                    clone: function () {
                        var t = n.clone.call(this);
                        return t._hash = this._hash.clone(),
                            t
                    }
                });

            function p(t, e, r) {
                return t ^ e ^ r
            }

            function _(t, e, r) {
                return t & e | ~t & r
            }

            function v(t, e, r) {
                return (t | ~e) ^ r
            }

            function y(t, e, r) {
                return t & r | e & ~r
            }

            function g(t, e, r) {
                return t ^ (e | ~r)
            }

            function B(t, e) {
                return t << e | t >>> 32 - e
            }

            e.RIPEMD160 = n._createHelper(d),
                e.HmacRIPEMD160 = n._createHmacHelper(d)
        }(Math),
        function () {
            var t = c
                , e = t.lib.Base
                , r = t.enc.Utf8;
            t.algo.HMAC = e.extend({
                init: function (t, e) {
                    t = this._hasher = new t.init,
                    "string" == typeof e && (e = r.parse(e));
                    var i = t.blockSize
                        , n = 4 * i;
                    e.sigBytes > n && (e = t.finalize(e)),
                        e.clamp();
                    for (var o = this._oKey = e.clone(), s = this._iKey = e.clone(), a = o.words, c = s.words, h = 0; h < i; h++)
                        a[h] ^= 1549556828,
                            c[h] ^= 909522486;
                    o.sigBytes = s.sigBytes = n,
                        this.reset()
                },
                reset: function () {
                    var t = this._hasher;
                    t.reset(),
                        t.update(this._iKey)
                },
                update: function (t) {
                    return this._hasher.update(t),
                        this
                },
                finalize: function (t) {
                    var e = this._hasher
                        , r = e.finalize(t);
                    return e.reset(),
                        e.finalize(this._oKey.clone().concat(r))
                }
            })
        }(),
        function () {
            var t = c
                , e = t.lib
                , r = e.Base
                , i = e.WordArray
                , n = t.algo
                , o = n.SHA256
                , s = n.HMAC
                , a = n.PBKDF2 = r.extend({
                cfg: r.extend({
                    keySize: 4,
                    hasher: o,
                    iterations: 25e4
                }),
                init: function (t) {
                    this.cfg = this.cfg.extend(t)
                },
                compute: function (t, e) {
                    for (var r = this.cfg, n = s.create(r.hasher, t), o = i.create(), a = i.create([1]), c = o.words, h = a.words, l = r.keySize, f = r.iterations; c.length < l;) {
                        var u = n.update(e).finalize(a);
                        n.reset();
                        for (var d = u.words, p = d.length, _ = u, v = 1; v < f; v++) {
                            _ = n.finalize(_),
                                n.reset();
                            for (var y = _.words, g = 0; g < p; g++)
                                d[g] ^= y[g]
                        }
                        o.concat(u),
                            h[0]++
                    }
                    return o.sigBytes = 4 * l,
                        o
                }
            });
            t.PBKDF2 = function (t, e, r) {
                return a.create(r).compute(t, e)
            }
        }(),
        function () {
            var t = c
                , e = t.lib
                , r = e.Base
                , i = e.WordArray
                , n = t.algo
                , o = n.MD5
                , s = n.EvpKDF = r.extend({
                cfg: r.extend({
                    keySize: 4,
                    hasher: o,
                    iterations: 1
                }),
                init: function (t) {
                    this.cfg = this.cfg.extend(t)
                },
                compute: function (t, e) {
                    for (var r, n = this.cfg, o = n.hasher.create(), s = i.create(), a = s.words, c = n.keySize, h = n.iterations; a.length < c;) {
                        r && o.update(r),
                            r = o.update(t).finalize(e),
                            o.reset();
                        for (var l = 1; l < h; l++)
                            r = o.finalize(r),
                                o.reset();
                        s.concat(r)
                    }
                    return s.sigBytes = 4 * c,
                        s
                }
            });
            t.EvpKDF = function (t, e, r) {
                return s.create(r).compute(t, e)
            }
        }(),
    c.lib.Cipher || function (t) {
        var e = c
            , r = e.lib
            , i = r.Base
            , n = r.WordArray
            , o = r.BufferedBlockAlgorithm
            , s = e.enc
            , a = (s.Utf8,
            s.Base64)
            , h = e.algo.EvpKDF
            , l = r.Cipher = o.extend({
            cfg: i.extend(),
            createEncryptor: function (t, e) {
                return this.create(this._ENC_XFORM_MODE, t, e)
            },
            createDecryptor: function (t, e) {
                return this.create(this._DEC_XFORM_MODE, t, e)
            },
            init: function (t, e, r) {
                this.cfg = this.cfg.extend(r),
                    this._xformMode = t,
                    this._key = e,
                    this.reset()
            },
            reset: function () {
                o.reset.call(this),
                    this._doReset()
            },
            process: function (t) {
                return this._append(t),
                    this._process()
            },
            finalize: function (t) {
                return t && this._append(t),
                    this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function () {
                function t(t) {
                    return "string" == typeof t ? B : y
                }

                return function (e) {
                    return {
                        encrypt: function (r, i, n) {
                            return t(i).encrypt(e, r, i, n)
                        },
                        decrypt: function (r, i, n) {
                            return t(i).decrypt(e, r, i, n)
                        }
                    }
                }
            }()
        })
            , f = (r.StreamCipher = l.extend({
            _doFinalize: function () {
                return this._process(!0)
            },
            blockSize: 1
        }),
            e.mode = {})
            , u = r.BlockCipherMode = i.extend({
            createEncryptor: function (t, e) {
                return this.Encryptor.create(t, e)
            },
            createDecryptor: function (t, e) {
                return this.Decryptor.create(t, e)
            },
            init: function (t, e) {
                this._cipher = t,
                    this._iv = e
            }
        })
            , d = f.CBC = function () {
            var t = u.extend();

            function e(t, e, r) {
                var i, n = this._iv;
                n ? (i = n,
                    this._iv = undefined) : i = this._prevBlock;
                for (var o = 0; o < r; o++)
                    t[e + o] ^= i[o]
            }

            return t.Encryptor = t.extend({
                processBlock: function (t, r) {
                    var i = this._cipher
                        , n = i.blockSize;
                    e.call(this, t, r, n),
                        i.encryptBlock(t, r),
                        this._prevBlock = t.slice(r, r + n)
                }
            }),
                t.Decryptor = t.extend({
                    processBlock: function (t, r) {
                        var i = this._cipher
                            , n = i.blockSize
                            , o = t.slice(r, r + n);
                        i.decryptBlock(t, r),
                            e.call(this, t, r, n),
                            this._prevBlock = o
                    }
                }),
                t
        }()
            , p = (e.pad = {}).Pkcs7 = {
            pad: function (t, e) {
                for (var r = 4 * e, i = r - t.sigBytes % r, o = i << 24 | i << 16 | i << 8 | i, s = [], a = 0; a < i; a += 4)
                    s.push(o);
                var c = n.create(s, i);
                t.concat(c)
            },
            unpad: function (t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        }
            , _ = (r.BlockCipher = l.extend({
            cfg: l.cfg.extend({
                mode: d,
                padding: p
            }),
            reset: function () {
                var t;
                l.reset.call(this);
                var e = this.cfg
                    , r = e.iv
                    , i = e.mode;
                this._xformMode == this._ENC_XFORM_MODE ? t = i.createEncryptor : (t = i.createDecryptor,
                    this._minBufferSize = 1),
                    this._mode && this._mode.__creator == t ? this._mode.init(this, r && r.words) : (this._mode = t.call(i, this, r && r.words),
                        this._mode.__creator = t)
            },
            _doProcessBlock: function (t, e) {
                this._mode.processBlock(t, e)
            },
            _doFinalize: function () {
                var t, e = this.cfg.padding;
                return this._xformMode == this._ENC_XFORM_MODE ? (e.pad(this._data, this.blockSize),
                    t = this._process(!0)) : (t = this._process(!0),
                    e.unpad(t)),
                    t
            },
            blockSize: 4
        }),
            r.CipherParams = i.extend({
                init: function (t) {
                    this.mixIn(t)
                },
                toString: function (t) {
                    return (t || this.formatter).stringify(this)
                }
            }))
            , v = (e.format = {}).OpenSSL = {
            stringify: function (t) {
                var e = t.ciphertext
                    , r = t.salt;
                return (r ? n.create([1398893684, 1701076831]).concat(r).concat(e) : e).toString(a)
            },
            parse: function (t) {
                var e, r = a.parse(t), i = r.words;
                return 1398893684 == i[0] && 1701076831 == i[1] && (e = n.create(i.slice(2, 4)),
                    i.splice(0, 4),
                    r.sigBytes -= 16),
                    _.create({
                        ciphertext: r,
                        salt: e
                    })
            }
        }
            , y = r.SerializableCipher = i.extend({
            cfg: i.extend({
                format: v
            }),
            encrypt: function (t, e, r, i) {
                i = this.cfg.extend(i);
                var n = t.createEncryptor(r, i)
                    , o = n.finalize(e)
                    , s = n.cfg;
                return _.create({
                    ciphertext: o,
                    key: r,
                    iv: s.iv,
                    algorithm: t,
                    mode: s.mode,
                    padding: s.padding,
                    blockSize: t.blockSize,
                    formatter: i.format
                })
            },
            decrypt: function (t, e, r, i) {
                return i = this.cfg.extend(i),
                    e = this._parse(e, i.format),
                    t.createDecryptor(r, i).finalize(e.ciphertext)
            },
            _parse: function (t, e) {
                return "string" == typeof t ? e.parse(t, this) : t
            }
        })
            , g = (e.kdf = {}).OpenSSL = {
            execute: function (t, e, r, i, o) {
                if (i || (i = n.random(8)),
                    o)
                    s = h.create({
                        keySize: e + r,
                        hasher: o
                    }).compute(t, i);
                else
                    var s = h.create({
                        keySize: e + r
                    }).compute(t, i);
                var a = n.create(s.words.slice(e), 4 * r);
                return s.sigBytes = 4 * e,
                    _.create({
                        key: s,
                        iv: a,
                        salt: i
                    })
            }
        }
            , B = r.PasswordBasedCipher = y.extend({
            cfg: y.cfg.extend({
                kdf: g
            }),
            encrypt: function (t, e, r, i) {
                var n = (i = this.cfg.extend(i)).kdf.execute(r, t.keySize, t.ivSize, i.salt, i.hasher);
                i.iv = n.iv;
                var o = y.encrypt.call(this, t, e, n.key, i);
                return o.mixIn(n),
                    o
            },
            decrypt: function (t, e, r, i) {
                i = this.cfg.extend(i),
                    e = this._parse(e, i.format);
                var n = i.kdf.execute(r, t.keySize, t.ivSize, e.salt, i.hasher);
                return i.iv = n.iv,
                    y.decrypt.call(this, t, e, n.key, i)
            }
        })
    }(),
        c.mode.CFB = function () {
            var t = c.lib.BlockCipherMode.extend();

            function e(t, e, r, i) {
                var n, o = this._iv;
                o ? (n = o.slice(0),
                    this._iv = void 0) : n = this._prevBlock,
                    i.encryptBlock(n, 0);
                for (var s = 0; s < r; s++)
                    t[e + s] ^= n[s]
            }

            return t.Encryptor = t.extend({
                processBlock: function (t, r) {
                    var i = this._cipher
                        , n = i.blockSize;
                    e.call(this, t, r, n, i),
                        this._prevBlock = t.slice(r, r + n)
                }
            }),
                t.Decryptor = t.extend({
                    processBlock: function (t, r) {
                        var i = this._cipher
                            , n = i.blockSize
                            , o = t.slice(r, r + n);
                        e.call(this, t, r, n, i),
                            this._prevBlock = o
                    }
                }),
                t
        }(),
        c.mode.CTR = (o = c.lib.BlockCipherMode.extend(),
            s = o.Encryptor = o.extend({
                processBlock: function (t, e) {
                    var r = this._cipher
                        , i = r.blockSize
                        , n = this._iv
                        , o = this._counter;
                    n && (o = this._counter = n.slice(0),
                        this._iv = void 0);
                    var s = o.slice(0);
                    r.encryptBlock(s, 0),
                        o[i - 1] = o[i - 1] + 1 | 0;
                    for (var a = 0; a < i; a++)
                        t[e + a] ^= s[a]
                }
            }),
            o.Decryptor = s,
            o),
        c.mode.CTRGladman = function () {
            var t = c.lib.BlockCipherMode.extend();

            function e(t) {
                if (255 == (t >> 24 & 255)) {
                    var e = t >> 16 & 255
                        , r = t >> 8 & 255
                        , i = 255 & t;
                    255 === e ? (e = 0,
                        255 === r ? (r = 0,
                            255 === i ? i = 0 : ++i) : ++r) : ++e,
                        t = 0,
                        t += e << 16,
                        t += r << 8,
                        t += i
                } else
                    t += 1 << 24;
                return t
            }

            var r = t.Encryptor = t.extend({
                processBlock: function (t, r) {
                    var i = this._cipher
                        , n = i.blockSize
                        , o = this._iv
                        , s = this._counter;
                    o && (s = this._counter = o.slice(0),
                        this._iv = void 0),
                        function (t) {
                            0 === (t[0] = e(t[0])) && (t[1] = e(t[1]))
                        }(s);
                    var a = s.slice(0);
                    i.encryptBlock(a, 0);
                    for (var c = 0; c < n; c++)
                        t[r + c] ^= a[c]
                }
            });
            return t.Decryptor = r,
                t
        }(),
        c.mode.OFB = function () {
            var t = c.lib.BlockCipherMode.extend()
                , e = t.Encryptor = t.extend({
                processBlock: function (t, e) {
                    var r = this._cipher
                        , i = r.blockSize
                        , n = this._iv
                        , o = this._keystream;
                    n && (o = this._keystream = n.slice(0),
                        this._iv = void 0),
                        r.encryptBlock(o, 0);
                    for (var s = 0; s < i; s++)
                        t[e + s] ^= o[s]
                }
            });
            return t.Decryptor = e,
                t
        }(),
        c.mode.ECB = ((a = c.lib.BlockCipherMode.extend()).Encryptor = a.extend({
            processBlock: function (t, e) {
                this._cipher.encryptBlock(t, e)
            }
        }),
            a.Decryptor = a.extend({
                processBlock: function (t, e) {
                    this._cipher.decryptBlock(t, e)
                }
            }),
            a),
        c.pad.AnsiX923 = {
            pad: function (t, e) {
                var r = t.sigBytes
                    , i = 4 * e
                    , n = i - r % i
                    , o = r + n - 1;
                t.clamp(),
                    t.words[o >>> 2] |= n << 24 - o % 4 * 8,
                    t.sigBytes += n
            },
            unpad: function (t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        },
        c.pad.Iso10126 = {
            pad: function (t, e) {
                var r = 4 * e
                    , i = r - t.sigBytes % r;
                t.concat(c.lib.WordArray.random(i - 1)).concat(c.lib.WordArray.create([i << 24], 1))
            },
            unpad: function (t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        },
        c.pad.Iso97971 = {
            pad: function (t, e) {
                t.concat(c.lib.WordArray.create([2147483648], 1)),
                    c.pad.ZeroPadding.pad(t, e)
            },
            unpad: function (t) {
                c.pad.ZeroPadding.unpad(t),
                    t.sigBytes--
            }
        },
        c.pad.ZeroPadding = {
            pad: function (t, e) {
                var r = 4 * e;
                t.clamp(),
                    t.sigBytes += r - (t.sigBytes % r || r)
            },
            unpad: function (t) {
                var e = t.words
                    , r = t.sigBytes - 1;
                for (r = t.sigBytes - 1; r >= 0; r--)
                    if (e[r >>> 2] >>> 24 - r % 4 * 8 & 255) {
                        t.sigBytes = r + 1;
                        break
                    }
            }
        },
        c.pad.NoPadding = {
            pad: function () {
            },
            unpad: function () {
            }
        },
        function (t) {
            var e = c
                , r = e.lib.CipherParams
                , i = e.enc.Hex;
            e.format.Hex = {
                stringify: function (t) {
                    return t.ciphertext.toString(i)
                },
                parse: function (t) {
                    var e = i.parse(t);
                    return r.create({
                        ciphertext: e
                    })
                }
            }
        }(),
        function () {
            var t = c
                , e = t.lib.BlockCipher
                , r = t.algo
                , i = []
                , n = []
                , o = []
                , s = []
                , a = []
                , h = []
                , l = []
                , f = []
                , u = []
                , d = [];
            !function () {
                for (var t = [], e = 0; e < 256; e++)
                    t[e] = e < 128 ? e << 1 : e << 1 ^ 283;
                var r = 0
                    , c = 0;
                for (e = 0; e < 256; e++) {
                    var p = c ^ c << 1 ^ c << 2 ^ c << 3 ^ c << 4;
                    p = p >>> 8 ^ 255 & p ^ 99,
                        i[r] = p,
                        n[p] = r;
                    var _ = t[r]
                        , v = t[_]
                        , y = t[v]
                        , g = 257 * t[p] ^ 16843008 * p;
                    o[r] = g << 24 | g >>> 8,
                        s[r] = g << 16 | g >>> 16,
                        a[r] = g << 8 | g >>> 24,
                        h[r] = g;
                    g = 16843009 * y ^ 65537 * v ^ 257 * _ ^ 16843008 * r;
                    l[p] = g << 24 | g >>> 8,
                        f[p] = g << 16 | g >>> 16,
                        u[p] = g << 8 | g >>> 24,
                        d[p] = g,
                        r ? (r = _ ^ t[t[t[y ^ _]]],
                            c ^= t[t[c]]) : r = c = 1
                }
            }();
            var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
                , _ = r.AES = e.extend({
                _doReset: function () {
                    if (!this._nRounds || this._keyPriorReset !== this._key) {
                        for (var t = this._keyPriorReset = this._key, e = t.words, r = t.sigBytes / 4, n = 4 * ((this._nRounds = r + 6) + 1), o = this._keySchedule = [], s = 0; s < n; s++)
                            s < r ? o[s] = e[s] : (h = o[s - 1],
                                s % r ? r > 6 && s % r == 4 && (h = i[h >>> 24] << 24 | i[h >>> 16 & 255] << 16 | i[h >>> 8 & 255] << 8 | i[255 & h]) : (h = i[(h = h << 8 | h >>> 24) >>> 24] << 24 | i[h >>> 16 & 255] << 16 | i[h >>> 8 & 255] << 8 | i[255 & h],
                                    h ^= p[s / r | 0] << 24),
                                o[s] = o[s - r] ^ h);
                        for (var a = this._invKeySchedule = [], c = 0; c < n; c++) {
                            s = n - c;
                            if (c % 4)
                                var h = o[s];
                            else
                                h = o[s - 4];
                            a[c] = c < 4 || s <= 4 ? h : l[i[h >>> 24]] ^ f[i[h >>> 16 & 255]] ^ u[i[h >>> 8 & 255]] ^ d[i[255 & h]]
                        }
                    }
                },
                encryptBlock: function (t, e) {
                    this._doCryptBlock(t, e, this._keySchedule, o, s, a, h, i)
                },
                decryptBlock: function (t, e) {
                    var r = t[e + 1];
                    t[e + 1] = t[e + 3],
                        t[e + 3] = r,
                        this._doCryptBlock(t, e, this._invKeySchedule, l, f, u, d, n);
                    r = t[e + 1];
                    t[e + 1] = t[e + 3],
                        t[e + 3] = r
                },
                _doCryptBlock: function (t, e, r, i, n, o, s, a) {
                    for (var c = this._nRounds, h = t[e] ^ r[0], l = t[e + 1] ^ r[1], f = t[e + 2] ^ r[2], u = t[e + 3] ^ r[3], d = 4, p = 1; p < c; p++) {
                        var _ = i[h >>> 24] ^ n[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ s[255 & u] ^ r[d++]
                            , v = i[l >>> 24] ^ n[f >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & h] ^ r[d++]
                            , y = i[f >>> 24] ^ n[u >>> 16 & 255] ^ o[h >>> 8 & 255] ^ s[255 & l] ^ r[d++]
                            , g = i[u >>> 24] ^ n[h >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & f] ^ r[d++];
                        h = _,
                            l = v,
                            f = y,
                            u = g
                    }
                    _ = (a[h >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[f >>> 8 & 255] << 8 | a[255 & u]) ^ r[d++],
                        v = (a[l >>> 24] << 24 | a[f >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & h]) ^ r[d++],
                        y = (a[f >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[h >>> 8 & 255] << 8 | a[255 & l]) ^ r[d++],
                        g = (a[u >>> 24] << 24 | a[h >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & f]) ^ r[d++];
                    t[e] = _,
                        t[e + 1] = v,
                        t[e + 2] = y,
                        t[e + 3] = g
                },
                keySize: 8
            });
            t.AES = e._createHelper(_)
        }(),
        function () {
            var t = c
                , e = t.lib
                , r = e.WordArray
                , i = e.BlockCipher
                , n = t.algo
                ,
                o = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]
                ,
                s = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]
                , a = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]
                , h = [{
                    0: 8421888,
                    268435456: 32768,
                    536870912: 8421378,
                    805306368: 2,
                    1073741824: 512,
                    1342177280: 8421890,
                    1610612736: 8389122,
                    1879048192: 8388608,
                    2147483648: 514,
                    2415919104: 8389120,
                    2684354560: 33280,
                    2952790016: 8421376,
                    3221225472: 32770,
                    3489660928: 8388610,
                    3758096384: 0,
                    4026531840: 33282,
                    134217728: 0,
                    402653184: 8421890,
                    671088640: 33282,
                    939524096: 32768,
                    1207959552: 8421888,
                    1476395008: 512,
                    1744830464: 8421378,
                    2013265920: 2,
                    2281701376: 8389120,
                    2550136832: 33280,
                    2818572288: 8421376,
                    3087007744: 8389122,
                    3355443200: 8388610,
                    3623878656: 32770,
                    3892314112: 514,
                    4160749568: 8388608,
                    1: 32768,
                    268435457: 2,
                    536870913: 8421888,
                    805306369: 8388608,
                    1073741825: 8421378,
                    1342177281: 33280,
                    1610612737: 512,
                    1879048193: 8389122,
                    2147483649: 8421890,
                    2415919105: 8421376,
                    2684354561: 8388610,
                    2952790017: 33282,
                    3221225473: 514,
                    3489660929: 8389120,
                    3758096385: 32770,
                    4026531841: 0,
                    134217729: 8421890,
                    402653185: 8421376,
                    671088641: 8388608,
                    939524097: 512,
                    1207959553: 32768,
                    1476395009: 8388610,
                    1744830465: 2,
                    2013265921: 33282,
                    2281701377: 32770,
                    2550136833: 8389122,
                    2818572289: 514,
                    3087007745: 8421888,
                    3355443201: 8389120,
                    3623878657: 0,
                    3892314113: 33280,
                    4160749569: 8421378
                }, {
                    0: 1074282512,
                    16777216: 16384,
                    33554432: 524288,
                    50331648: 1074266128,
                    67108864: 1073741840,
                    83886080: 1074282496,
                    100663296: 1073758208,
                    117440512: 16,
                    134217728: 540672,
                    150994944: 1073758224,
                    167772160: 1073741824,
                    184549376: 540688,
                    201326592: 524304,
                    218103808: 0,
                    234881024: 16400,
                    251658240: 1074266112,
                    8388608: 1073758208,
                    25165824: 540688,
                    41943040: 16,
                    58720256: 1073758224,
                    75497472: 1074282512,
                    92274688: 1073741824,
                    109051904: 524288,
                    125829120: 1074266128,
                    142606336: 524304,
                    159383552: 0,
                    176160768: 16384,
                    192937984: 1074266112,
                    209715200: 1073741840,
                    226492416: 540672,
                    243269632: 1074282496,
                    260046848: 16400,
                    268435456: 0,
                    285212672: 1074266128,
                    301989888: 1073758224,
                    318767104: 1074282496,
                    335544320: 1074266112,
                    352321536: 16,
                    369098752: 540688,
                    385875968: 16384,
                    402653184: 16400,
                    419430400: 524288,
                    436207616: 524304,
                    452984832: 1073741840,
                    469762048: 540672,
                    486539264: 1073758208,
                    503316480: 1073741824,
                    520093696: 1074282512,
                    276824064: 540688,
                    293601280: 524288,
                    310378496: 1074266112,
                    327155712: 16384,
                    343932928: 1073758208,
                    360710144: 1074282512,
                    377487360: 16,
                    394264576: 1073741824,
                    411041792: 1074282496,
                    427819008: 1073741840,
                    444596224: 1073758224,
                    461373440: 524304,
                    478150656: 0,
                    494927872: 16400,
                    511705088: 1074266128,
                    528482304: 540672
                }, {
                    0: 260,
                    1048576: 0,
                    2097152: 67109120,
                    3145728: 65796,
                    4194304: 65540,
                    5242880: 67108868,
                    6291456: 67174660,
                    7340032: 67174400,
                    8388608: 67108864,
                    9437184: 67174656,
                    10485760: 65792,
                    11534336: 67174404,
                    12582912: 67109124,
                    13631488: 65536,
                    14680064: 4,
                    15728640: 256,
                    524288: 67174656,
                    1572864: 67174404,
                    2621440: 0,
                    3670016: 67109120,
                    4718592: 67108868,
                    5767168: 65536,
                    6815744: 65540,
                    7864320: 260,
                    8912896: 4,
                    9961472: 256,
                    11010048: 67174400,
                    12058624: 65796,
                    13107200: 65792,
                    14155776: 67109124,
                    15204352: 67174660,
                    16252928: 67108864,
                    16777216: 67174656,
                    17825792: 65540,
                    18874368: 65536,
                    19922944: 67109120,
                    20971520: 256,
                    22020096: 67174660,
                    23068672: 67108868,
                    24117248: 0,
                    25165824: 67109124,
                    26214400: 67108864,
                    27262976: 4,
                    28311552: 65792,
                    29360128: 67174400,
                    30408704: 260,
                    31457280: 65796,
                    32505856: 67174404,
                    17301504: 67108864,
                    18350080: 260,
                    19398656: 67174656,
                    20447232: 0,
                    21495808: 65540,
                    22544384: 67109120,
                    23592960: 256,
                    24641536: 67174404,
                    25690112: 65536,
                    26738688: 67174660,
                    27787264: 65796,
                    28835840: 67108868,
                    29884416: 67109124,
                    30932992: 67174400,
                    31981568: 4,
                    33030144: 65792
                }, {
                    0: 2151682048,
                    65536: 2147487808,
                    131072: 4198464,
                    196608: 2151677952,
                    262144: 0,
                    327680: 4198400,
                    393216: 2147483712,
                    458752: 4194368,
                    524288: 2147483648,
                    589824: 4194304,
                    655360: 64,
                    720896: 2147487744,
                    786432: 2151678016,
                    851968: 4160,
                    917504: 4096,
                    983040: 2151682112,
                    32768: 2147487808,
                    98304: 64,
                    163840: 2151678016,
                    229376: 2147487744,
                    294912: 4198400,
                    360448: 2151682112,
                    425984: 0,
                    491520: 2151677952,
                    557056: 4096,
                    622592: 2151682048,
                    688128: 4194304,
                    753664: 4160,
                    819200: 2147483648,
                    884736: 4194368,
                    950272: 4198464,
                    1015808: 2147483712,
                    1048576: 4194368,
                    1114112: 4198400,
                    1179648: 2147483712,
                    1245184: 0,
                    1310720: 4160,
                    1376256: 2151678016,
                    1441792: 2151682048,
                    1507328: 2147487808,
                    1572864: 2151682112,
                    1638400: 2147483648,
                    1703936: 2151677952,
                    1769472: 4198464,
                    1835008: 2147487744,
                    1900544: 4194304,
                    1966080: 64,
                    2031616: 4096,
                    1081344: 2151677952,
                    1146880: 2151682112,
                    1212416: 0,
                    1277952: 4198400,
                    1343488: 4194368,
                    1409024: 2147483648,
                    1474560: 2147487808,
                    1540096: 64,
                    1605632: 2147483712,
                    1671168: 4096,
                    1736704: 2147487744,
                    1802240: 2151678016,
                    1867776: 4160,
                    1933312: 2151682048,
                    1998848: 4194304,
                    2064384: 4198464
                }, {
                    0: 128,
                    4096: 17039360,
                    8192: 262144,
                    12288: 536870912,
                    16384: 537133184,
                    20480: 16777344,
                    24576: 553648256,
                    28672: 262272,
                    32768: 16777216,
                    36864: 537133056,
                    40960: 536871040,
                    45056: 553910400,
                    49152: 553910272,
                    53248: 0,
                    57344: 17039488,
                    61440: 553648128,
                    2048: 17039488,
                    6144: 553648256,
                    10240: 128,
                    14336: 17039360,
                    18432: 262144,
                    22528: 537133184,
                    26624: 553910272,
                    30720: 536870912,
                    34816: 537133056,
                    38912: 0,
                    43008: 553910400,
                    47104: 16777344,
                    51200: 536871040,
                    55296: 553648128,
                    59392: 16777216,
                    63488: 262272,
                    65536: 262144,
                    69632: 128,
                    73728: 536870912,
                    77824: 553648256,
                    81920: 16777344,
                    86016: 553910272,
                    90112: 537133184,
                    94208: 16777216,
                    98304: 553910400,
                    102400: 553648128,
                    106496: 17039360,
                    110592: 537133056,
                    114688: 262272,
                    118784: 536871040,
                    122880: 0,
                    126976: 17039488,
                    67584: 553648256,
                    71680: 16777216,
                    75776: 17039360,
                    79872: 537133184,
                    83968: 536870912,
                    88064: 17039488,
                    92160: 128,
                    96256: 553910272,
                    100352: 262272,
                    104448: 553910400,
                    108544: 0,
                    112640: 553648128,
                    116736: 16777344,
                    120832: 262144,
                    124928: 537133056,
                    129024: 536871040
                }, {
                    0: 268435464,
                    256: 8192,
                    512: 270532608,
                    768: 270540808,
                    1024: 268443648,
                    1280: 2097152,
                    1536: 2097160,
                    1792: 268435456,
                    2048: 0,
                    2304: 268443656,
                    2560: 2105344,
                    2816: 8,
                    3072: 270532616,
                    3328: 2105352,
                    3584: 8200,
                    3840: 270540800,
                    128: 270532608,
                    384: 270540808,
                    640: 8,
                    896: 2097152,
                    1152: 2105352,
                    1408: 268435464,
                    1664: 268443648,
                    1920: 8200,
                    2176: 2097160,
                    2432: 8192,
                    2688: 268443656,
                    2944: 270532616,
                    3200: 0,
                    3456: 270540800,
                    3712: 2105344,
                    3968: 268435456,
                    4096: 268443648,
                    4352: 270532616,
                    4608: 270540808,
                    4864: 8200,
                    5120: 2097152,
                    5376: 268435456,
                    5632: 268435464,
                    5888: 2105344,
                    6144: 2105352,
                    6400: 0,
                    6656: 8,
                    6912: 270532608,
                    7168: 8192,
                    7424: 268443656,
                    7680: 270540800,
                    7936: 2097160,
                    4224: 8,
                    4480: 2105344,
                    4736: 2097152,
                    4992: 268435464,
                    5248: 268443648,
                    5504: 8200,
                    5760: 270540808,
                    6016: 270532608,
                    6272: 270540800,
                    6528: 270532616,
                    6784: 8192,
                    7040: 2105352,
                    7296: 2097160,
                    7552: 0,
                    7808: 268435456,
                    8064: 268443656
                }, {
                    0: 1048576,
                    16: 33555457,
                    32: 1024,
                    48: 1049601,
                    64: 34604033,
                    80: 0,
                    96: 1,
                    112: 34603009,
                    128: 33555456,
                    144: 1048577,
                    160: 33554433,
                    176: 34604032,
                    192: 34603008,
                    208: 1025,
                    224: 1049600,
                    240: 33554432,
                    8: 34603009,
                    24: 0,
                    40: 33555457,
                    56: 34604032,
                    72: 1048576,
                    88: 33554433,
                    104: 33554432,
                    120: 1025,
                    136: 1049601,
                    152: 33555456,
                    168: 34603008,
                    184: 1048577,
                    200: 1024,
                    216: 34604033,
                    232: 1,
                    248: 1049600,
                    256: 33554432,
                    272: 1048576,
                    288: 33555457,
                    304: 34603009,
                    320: 1048577,
                    336: 33555456,
                    352: 34604032,
                    368: 1049601,
                    384: 1025,
                    400: 34604033,
                    416: 1049600,
                    432: 1,
                    448: 0,
                    464: 34603008,
                    480: 33554433,
                    496: 1024,
                    264: 1049600,
                    280: 33555457,
                    296: 34603009,
                    312: 1,
                    328: 33554432,
                    344: 1048576,
                    360: 1025,
                    376: 34604032,
                    392: 33554433,
                    408: 34603008,
                    424: 0,
                    440: 34604033,
                    456: 1049601,
                    472: 1024,
                    488: 33555456,
                    504: 1048577
                }, {
                    0: 134219808,
                    1: 131072,
                    2: 134217728,
                    3: 32,
                    4: 131104,
                    5: 134350880,
                    6: 134350848,
                    7: 2048,
                    8: 134348800,
                    9: 134219776,
                    10: 133120,
                    11: 134348832,
                    12: 2080,
                    13: 0,
                    14: 134217760,
                    15: 133152,
                    2147483648: 2048,
                    2147483649: 134350880,
                    2147483650: 134219808,
                    2147483651: 134217728,
                    2147483652: 134348800,
                    2147483653: 133120,
                    2147483654: 133152,
                    2147483655: 32,
                    2147483656: 134217760,
                    2147483657: 2080,
                    2147483658: 131104,
                    2147483659: 134350848,
                    2147483660: 0,
                    2147483661: 134348832,
                    2147483662: 134219776,
                    2147483663: 131072,
                    16: 133152,
                    17: 134350848,
                    18: 32,
                    19: 2048,
                    20: 134219776,
                    21: 134217760,
                    22: 134348832,
                    23: 131072,
                    24: 0,
                    25: 131104,
                    26: 134348800,
                    27: 134219808,
                    28: 134350880,
                    29: 133120,
                    30: 2080,
                    31: 134217728,
                    2147483664: 131072,
                    2147483665: 2048,
                    2147483666: 134348832,
                    2147483667: 133152,
                    2147483668: 32,
                    2147483669: 134348800,
                    2147483670: 134217728,
                    2147483671: 134219808,
                    2147483672: 134350880,
                    2147483673: 134217760,
                    2147483674: 134219776,
                    2147483675: 0,
                    2147483676: 133120,
                    2147483677: 2080,
                    2147483678: 131104,
                    2147483679: 134350848
                }]
                , l = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679]
                , f = n.DES = i.extend({
                    _doReset: function () {
                        for (var t = this._key.words, e = [], r = 0; r < 56; r++) {
                            var i = o[r] - 1;
                            e[r] = t[i >>> 5] >>> 31 - i % 32 & 1
                        }
                        for (var n = this._subKeys = [], c = 0; c < 16; c++) {
                            var h = n[c] = []
                                , l = a[c];
                            for (r = 0; r < 24; r++)
                                h[r / 6 | 0] |= e[(s[r] - 1 + l) % 28] << 31 - r % 6,
                                    h[4 + (r / 6 | 0)] |= e[28 + (s[r + 24] - 1 + l) % 28] << 31 - r % 6;
                            h[0] = h[0] << 1 | h[0] >>> 31;
                            for (r = 1; r < 7; r++)
                                h[r] = h[r] >>> 4 * (r - 1) + 3;
                            h[7] = h[7] << 5 | h[7] >>> 27
                        }
                        var f = this._invSubKeys = [];
                        for (r = 0; r < 16; r++)
                            f[r] = n[15 - r]
                    },
                    encryptBlock: function (t, e) {
                        this._doCryptBlock(t, e, this._subKeys)
                    },
                    decryptBlock: function (t, e) {
                        this._doCryptBlock(t, e, this._invSubKeys)
                    },
                    _doCryptBlock: function (t, e, r) {
                        this._lBlock = t[e],
                            this._rBlock = t[e + 1],
                            u.call(this, 4, 252645135),
                            u.call(this, 16, 65535),
                            d.call(this, 2, 858993459),
                            d.call(this, 8, 16711935),
                            u.call(this, 1, 1431655765);
                        for (var i = 0; i < 16; i++) {
                            for (var n = r[i], o = this._lBlock, s = this._rBlock, a = 0, c = 0; c < 8; c++)
                                a |= h[c][((s ^ n[c]) & l[c]) >>> 0];
                            this._lBlock = s,
                                this._rBlock = o ^ a
                        }
                        var f = this._lBlock;
                        this._lBlock = this._rBlock,
                            this._rBlock = f,
                            u.call(this, 1, 1431655765),
                            d.call(this, 8, 16711935),
                            d.call(this, 2, 858993459),
                            u.call(this, 16, 65535),
                            u.call(this, 4, 252645135),
                            t[e] = this._lBlock,
                            t[e + 1] = this._rBlock
                    },
                    keySize: 2,
                    ivSize: 2,
                    blockSize: 2
                });

            function u(t, e) {
                var r = (this._lBlock >>> t ^ this._rBlock) & e;
                this._rBlock ^= r,
                    this._lBlock ^= r << t
            }

            function d(t, e) {
                var r = (this._rBlock >>> t ^ this._lBlock) & e;
                this._lBlock ^= r,
                    this._rBlock ^= r << t
            }

            t.DES = i._createHelper(f);
            var p = n.TripleDES = i.extend({
                _doReset: function () {
                    var t = this._key.words;
                    if (2 !== t.length && 4 !== t.length && t.length < 6)
                        throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
                    var e = t.slice(0, 2)
                        , i = t.length < 4 ? t.slice(0, 2) : t.slice(2, 4)
                        , n = t.length < 6 ? t.slice(0, 2) : t.slice(4, 6);
                    this._des1 = f.createEncryptor(r.create(e)),
                        this._des2 = f.createEncryptor(r.create(i)),
                        this._des3 = f.createEncryptor(r.create(n))
                },
                encryptBlock: function (t, e) {
                    this._des1.encryptBlock(t, e),
                        this._des2.decryptBlock(t, e),
                        this._des3.encryptBlock(t, e)
                },
                decryptBlock: function (t, e) {
                    this._des3.decryptBlock(t, e),
                        this._des2.encryptBlock(t, e),
                        this._des1.decryptBlock(t, e)
                },
                keySize: 6,
                ivSize: 2,
                blockSize: 2
            });
            t.TripleDES = i._createHelper(p)
        }(),
        function () {
            var t = c
                , e = t.lib.StreamCipher
                , r = t.algo
                , i = r.RC4 = e.extend({
                _doReset: function () {
                    for (var t = this._key, e = t.words, r = t.sigBytes, i = this._S = [], n = 0; n < 256; n++)
                        i[n] = n;
                    n = 0;
                    for (var o = 0; n < 256; n++) {
                        var s = n % r
                            , a = e[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                        o = (o + i[n] + a) % 256;
                        var c = i[n];
                        i[n] = i[o],
                            i[o] = c
                    }
                    this._i = this._j = 0
                },
                _doProcessBlock: function (t, e) {
                    t[e] ^= n.call(this)
                },
                keySize: 8,
                ivSize: 0
            });

            function n() {
                for (var t = this._S, e = this._i, r = this._j, i = 0, n = 0; n < 4; n++) {
                    r = (r + t[e = (e + 1) % 256]) % 256;
                    var o = t[e];
                    t[e] = t[r],
                        t[r] = o,
                        i |= t[(t[e] + t[r]) % 256] << 24 - 8 * n
                }
                return this._i = e,
                    this._j = r,
                    i
            }

            t.RC4 = e._createHelper(i);
            var o = r.RC4Drop = i.extend({
                cfg: i.cfg.extend({
                    drop: 192
                }),
                _doReset: function () {
                    i._doReset.call(this);
                    for (var t = this.cfg.drop; t > 0; t--)
                        n.call(this)
                }
            });
            t.RC4Drop = e._createHelper(o)
        }(),
        function () {
            var t = c
                , e = t.lib.StreamCipher
                , r = t.algo
                , i = []
                , n = []
                , o = []
                , s = r.Rabbit = e.extend({
                _doReset: function () {
                    for (var t = this._key.words, e = this.cfg.iv, r = 0; r < 4; r++)
                        t[r] = 16711935 & (t[r] << 8 | t[r] >>> 24) | 4278255360 & (t[r] << 24 | t[r] >>> 8);
                    var i = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16]
                        ,
                        n = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
                    this._b = 0;
                    for (r = 0; r < 4; r++)
                        a.call(this);
                    for (r = 0; r < 8; r++)
                        n[r] ^= i[r + 4 & 7];
                    if (e) {
                        var o = e.words
                            , s = o[0]
                            , c = o[1]
                            , h = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                            , l = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                            , f = h >>> 16 | 4294901760 & l
                            , u = l << 16 | 65535 & h;
                        n[0] ^= h,
                            n[1] ^= f,
                            n[2] ^= l,
                            n[3] ^= u,
                            n[4] ^= h,
                            n[5] ^= f,
                            n[6] ^= l,
                            n[7] ^= u;
                        for (r = 0; r < 4; r++)
                            a.call(this)
                    }
                },
                _doProcessBlock: function (t, e) {
                    var r = this._X;
                    a.call(this),
                        i[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
                        i[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
                        i[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
                        i[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
                    for (var n = 0; n < 4; n++)
                        i[n] = 16711935 & (i[n] << 8 | i[n] >>> 24) | 4278255360 & (i[n] << 24 | i[n] >>> 8),
                            t[e + n] ^= i[n]
                },
                blockSize: 4,
                ivSize: 2
            });

            function a() {
                for (var t = this._X, e = this._C, r = 0; r < 8; r++)
                    n[r] = e[r];
                e[0] = e[0] + 1295307597 + this._b | 0,
                    e[1] = e[1] + 3545052371 + (e[0] >>> 0 < n[0] >>> 0 ? 1 : 0) | 0,
                    e[2] = e[2] + 886263092 + (e[1] >>> 0 < n[1] >>> 0 ? 1 : 0) | 0,
                    e[3] = e[3] + 1295307597 + (e[2] >>> 0 < n[2] >>> 0 ? 1 : 0) | 0,
                    e[4] = e[4] + 3545052371 + (e[3] >>> 0 < n[3] >>> 0 ? 1 : 0) | 0,
                    e[5] = e[5] + 886263092 + (e[4] >>> 0 < n[4] >>> 0 ? 1 : 0) | 0,
                    e[6] = e[6] + 1295307597 + (e[5] >>> 0 < n[5] >>> 0 ? 1 : 0) | 0,
                    e[7] = e[7] + 3545052371 + (e[6] >>> 0 < n[6] >>> 0 ? 1 : 0) | 0,
                    this._b = e[7] >>> 0 < n[7] >>> 0 ? 1 : 0;
                for (r = 0; r < 8; r++) {
                    var i = t[r] + e[r]
                        , s = 65535 & i
                        , a = i >>> 16
                        , c = ((s * s >>> 17) + s * a >>> 15) + a * a
                        , h = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                    o[r] = c ^ h
                }
                t[0] = o[0] + (o[7] << 16 | o[7] >>> 16) + (o[6] << 16 | o[6] >>> 16) | 0,
                    t[1] = o[1] + (o[0] << 8 | o[0] >>> 24) + o[7] | 0,
                    t[2] = o[2] + (o[1] << 16 | o[1] >>> 16) + (o[0] << 16 | o[0] >>> 16) | 0,
                    t[3] = o[3] + (o[2] << 8 | o[2] >>> 24) + o[1] | 0,
                    t[4] = o[4] + (o[3] << 16 | o[3] >>> 16) + (o[2] << 16 | o[2] >>> 16) | 0,
                    t[5] = o[5] + (o[4] << 8 | o[4] >>> 24) + o[3] | 0,
                    t[6] = o[6] + (o[5] << 16 | o[5] >>> 16) + (o[4] << 16 | o[4] >>> 16) | 0,
                    t[7] = o[7] + (o[6] << 8 | o[6] >>> 24) + o[5] | 0
            }

            t.Rabbit = e._createHelper(s)
        }(),
        function () {
            var t = c
                , e = t.lib.StreamCipher
                , r = t.algo
                , i = []
                , n = []
                , o = []
                , s = r.RabbitLegacy = e.extend({
                _doReset: function () {
                    var t = this._key.words
                        , e = this.cfg.iv
                        ,
                        r = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16]
                        ,
                        i = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
                    this._b = 0;
                    for (var n = 0; n < 4; n++)
                        a.call(this);
                    for (n = 0; n < 8; n++)
                        i[n] ^= r[n + 4 & 7];
                    if (e) {
                        var o = e.words
                            , s = o[0]
                            , c = o[1]
                            , h = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                            , l = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                            , f = h >>> 16 | 4294901760 & l
                            , u = l << 16 | 65535 & h;
                        i[0] ^= h,
                            i[1] ^= f,
                            i[2] ^= l,
                            i[3] ^= u,
                            i[4] ^= h,
                            i[5] ^= f,
                            i[6] ^= l,
                            i[7] ^= u;
                        for (n = 0; n < 4; n++)
                            a.call(this)
                    }
                },
                _doProcessBlock: function (t, e) {
                    var r = this._X;
                    a.call(this),
                        i[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
                        i[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
                        i[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
                        i[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
                    for (var n = 0; n < 4; n++)
                        i[n] = 16711935 & (i[n] << 8 | i[n] >>> 24) | 4278255360 & (i[n] << 24 | i[n] >>> 8),
                            t[e + n] ^= i[n]
                },
                blockSize: 4,
                ivSize: 2
            });

            function a() {
                for (var t = this._X, e = this._C, r = 0; r < 8; r++)
                    n[r] = e[r];
                e[0] = e[0] + 1295307597 + this._b | 0,
                    e[1] = e[1] + 3545052371 + (e[0] >>> 0 < n[0] >>> 0 ? 1 : 0) | 0,
                    e[2] = e[2] + 886263092 + (e[1] >>> 0 < n[1] >>> 0 ? 1 : 0) | 0,
                    e[3] = e[3] + 1295307597 + (e[2] >>> 0 < n[2] >>> 0 ? 1 : 0) | 0,
                    e[4] = e[4] + 3545052371 + (e[3] >>> 0 < n[3] >>> 0 ? 1 : 0) | 0,
                    e[5] = e[5] + 886263092 + (e[4] >>> 0 < n[4] >>> 0 ? 1 : 0) | 0,
                    e[6] = e[6] + 1295307597 + (e[5] >>> 0 < n[5] >>> 0 ? 1 : 0) | 0,
                    e[7] = e[7] + 3545052371 + (e[6] >>> 0 < n[6] >>> 0 ? 1 : 0) | 0,
                    this._b = e[7] >>> 0 < n[7] >>> 0 ? 1 : 0;
                for (r = 0; r < 8; r++) {
                    var i = t[r] + e[r]
                        , s = 65535 & i
                        , a = i >>> 16
                        , c = ((s * s >>> 17) + s * a >>> 15) + a * a
                        , h = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                    o[r] = c ^ h
                }
                t[0] = o[0] + (o[7] << 16 | o[7] >>> 16) + (o[6] << 16 | o[6] >>> 16) | 0,
                    t[1] = o[1] + (o[0] << 8 | o[0] >>> 24) + o[7] | 0,
                    t[2] = o[2] + (o[1] << 16 | o[1] >>> 16) + (o[0] << 16 | o[0] >>> 16) | 0,
                    t[3] = o[3] + (o[2] << 8 | o[2] >>> 24) + o[1] | 0,
                    t[4] = o[4] + (o[3] << 16 | o[3] >>> 16) + (o[2] << 16 | o[2] >>> 16) | 0,
                    t[5] = o[5] + (o[4] << 8 | o[4] >>> 24) + o[3] | 0,
                    t[6] = o[6] + (o[5] << 16 | o[5] >>> 16) + (o[4] << 16 | o[4] >>> 16) | 0,
                    t[7] = o[7] + (o[6] << 8 | o[6] >>> 24) + o[5] | 0
            }

            t.RabbitLegacy = e._createHelper(s)
        }(),
        function () {
            var t = c
                , e = t.lib.BlockCipher
                , r = t.algo;
            const i = 16
                ,
                n = [608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731]
                ,
                o = [[3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946], [1266315497, 3048417604, 3681880366, 3289982499, 290971e4, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055], [3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504], [976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409e3, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462]];
            var s = {
                pbox: [],
                sbox: []
            };

            function a(t, e) {
                let r = e >> 24 & 255
                    , i = e >> 16 & 255
                    , n = e >> 8 & 255
                    , o = 255 & e
                    , s = t.sbox[0][r] + t.sbox[1][i];
                return s ^= t.sbox[2][n],
                    s += t.sbox[3][o],
                    s
            }

            function h(t, e, r) {
                let n, o = e, s = r;
                for (let e = 0; e < i; ++e)
                    o ^= t.pbox[e],
                        s = a(t, o) ^ s,
                        n = o,
                        o = s,
                        s = n;
                return n = o,
                    o = s,
                    s = n,
                    s ^= t.pbox[i],
                    o ^= t.pbox[i + 1],
                    {
                        left: o,
                        right: s
                    }
            }

            var l = r.Blowfish = e.extend({
                _doReset: function () {
                    if (this._keyPriorReset !== this._key) {
                        var t = this._keyPriorReset = this._key
                            , e = t.words
                            , r = t.sigBytes / 4;
                        !function (t, e, r) {
                            for (let e = 0; e < 4; e++) {
                                t.sbox[e] = [];
                                for (let r = 0; r < 256; r++)
                                    t.sbox[e][r] = o[e][r]
                            }
                            let s = 0;
                            for (let o = 0; o < i + 2; o++)
                                t.pbox[o] = n[o] ^ e[s],
                                    s++,
                                s >= r && (s = 0);
                            let a = 0
                                , c = 0
                                , l = 0;
                            for (let e = 0; e < i + 2; e += 2)
                                l = h(t, a, c),
                                    a = l.left,
                                    c = l.right,
                                    t.pbox[e] = a,
                                    t.pbox[e + 1] = c;
                            for (let e = 0; e < 4; e++)
                                for (let r = 0; r < 256; r += 2)
                                    l = h(t, a, c),
                                        a = l.left,
                                        c = l.right,
                                        t.sbox[e][r] = a,
                                        t.sbox[e][r + 1] = c
                        }(s, e, r)
                    }
                },
                encryptBlock: function (t, e) {
                    var r = h(s, t[e], t[e + 1]);
                    t[e] = r.left,
                        t[e + 1] = r.right
                },
                decryptBlock: function (t, e) {
                    var r = function (t, e, r) {
                        let n, o = e, s = r;
                        for (let e = i + 1; e > 1; --e)
                            o ^= t.pbox[e],
                                s = a(t, o) ^ s,
                                n = o,
                                o = s,
                                s = n;
                        return n = o,
                            o = s,
                            s = n,
                            s ^= t.pbox[1],
                            o ^= t.pbox[0],
                            {
                                left: o,
                                right: s
                            }
                    }(s, t[e], t[e + 1]);
                    t[e] = r.left,
                        t[e + 1] = r.right
                },
                blockSize: 2,
                keySize: 4,
                ivSize: 2
            });
            t.Blowfish = e._createHelper(l)
        }(),
        c
}


function Env(a, b) {
    var c = Math.floor;
    return new class {
        constructor(a, b) {
            this.name = a, this.version = "1.7.4", this.data = null, this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "", this.encoding = "utf-8", this.startTime = new Date().getTime(), Object.assign(this, b), this.log("", "🔔" + this.name + ", 开始!")
        }

        platform() {
            return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" == typeof module || !module.exports ? "undefined" == typeof $task ? "undefined" == typeof $loon ? "undefined" == typeof $rocket ? "undefined" == typeof Egern ? void 0 : "Egern" : "Shadowrocket" : "Loon" : "Quantumult X" : "Node.js"
        }

        isQuanX() {
            return "Quantumult X" === this.platform()
        }

        isSurge() {
            return "Surge" === this.platform()
        }

        isLoon() {
            return "Loon" === this.platform()
        }

        isShadowrocket() {
            return "Shadowrocket" === this.platform()
        }

        isStash() {
            return "Stash" === this.platform()
        }

        isEgern() {
            return "Egern" === this.platform()
        }

        toObj(a, b = null) {
            try {
                return JSON.parse(a)
            } catch {
                return b
            }
        }

        toStr(a, b = null) {
            try {
                return JSON.stringify(a)
            } catch {
                return b
            }
        }

        lodash_get(a = {}, b = "", c = void 0) {
            Array.isArray(b) || (b = this.toPath(b));
            const d = b.reduce((a, b) => Object(a)[b], a);
            return d === void 0 ? c : d
        }

        lodash_set(a = {}, b = "", c) {
            return Array.isArray(b) || (b = this.toPath(b)), b.slice(0, -1).reduce((a, c, d) => Object(a[c]) === a[c] ? a[c] : a[c] = /^d+$/.test(b[d + 1]) ? [] : {}, a)[b[b.length - 1]] = c, a
        }

        toPath(a) {
            return a.replace(/[(d+)]/g, ".$1").split(".").filter(Boolean)
        }

        getItem(a = new String, b = null) {
            let c = b;
            switch (a.startsWith("@")) {
                case!0:
                    const {key: b, path: d} = a.match(/^@(?<key>[^.]+)(?:.(?<path>.*))?$/)?.groups;
                    a = b;
                    let e = this.getItem(a, {});
                    "object" != typeof e && (e = {}), c = this.lodash_get(e, d);
                    try {
                        c = JSON.parse(c)
                    } catch (a) {
                    }
                    break;
                default:
                    switch (this.platform()) {
                        case"Surge":
                        case"Loon":
                        case"Stash":
                        case"Egern":
                        case"Shadowrocket":
                            c = $persistentStore.read(a);
                            break;
                        case"Quantumult X":
                            c = $prefs.valueForKey(a);
                            break;
                        default:
                            c = this.data?.[a] || null
                    }
                    try {
                        c = JSON.parse(c)
                    } catch (a) {
                    }
            }
            return c ?? b
        }

        setItem(a = new String, b = new String) {
            let c = !1;
            switch (typeof b) {
                case"object":
                    b = JSON.stringify(b);
                    break;
                default:
                    b = b + ""
            }
            switch (a.startsWith("@")) {
                case!0:
                    const {key: d, path: e} = a.match(/^@(?<key>[^.]+)(?:.(?<path>.*))?$/)?.groups;
                    a = d;
                    let f = this.getItem(a, {});
                    "object" != typeof f && (f = {}), this.lodash_set(f, e, b), c = this.setItem(a, f);
                    break;
                default:
                    switch (this.platform()) {
                        case"Surge":
                        case"Loon":
                        case"Stash":
                        case"Egern":
                        case"Shadowrocket":
                            c = $persistentStore.write(b, a);
                            break;
                        case"Quantumult X":
                            c = $prefs.setValueForKey(b, a);
                            break;
                        default:
                            c = this.data?.[a] || null
                    }
            }
            return c
        }

        async fetch(a = {}, b = {}) {
            switch (a.constructor) {
                case Object:
                    a = {...a, ...b};
                    break;
                case String:
                    a = {url: a, ...b}
            }
            a.method || (a.method = a.body ?? a.bodyBytes ? "POST" : "GET"), delete a.headers?.Host, delete a.headers?.[":authority"], delete a.headers?.["Content-Length"], delete a.headers?.["content-length"];
            const c = a.method.toLocaleLowerCase();
            switch (this.platform()) {
                case"Loon":
                case"Surge":
                case"Stash":
                case"Egern":
                case"Shadowrocket":
                default:
                    return a.policy && (this.isLoon() && (a.node = a.policy), this.isStash() && this.lodash_set(a, "headers.X-Stash-Selected-Proxy", encodeURI(a.policy))), a.followRedirect && ((this.isSurge() || this.isLoon()) && (a["auto-redirect"] = !1), this.isQuanX() && (a.opts ? a.opts.redirection = !1 : a.opts = {redirection: !1})), a.bodyBytes && !a.body && (a.body = a.bodyBytes, delete a.bodyBytes), await new Promise((b, d) => {
                        $httpClient[c](a, (c, e, f) => {
                            c ? d(c) : (e.ok = /^2dd$/.test(e.status), e.statusCode = e.status, f && (e.body = f, !0 == a["binary-mode"] && (e.bodyBytes = f)), b(e))
                        })
                    });
                case"Quantumult X":
                    return a.policy && this.lodash_set(a, "opts.policy", a.policy), "boolean" == typeof a["auto-redirect"] && this.lodash_set(a, "opts.redirection", a["auto-redirect"]), a.body instanceof ArrayBuffer ? (a.bodyBytes = a.body, delete a.body) : ArrayBuffer.isView(a.body) ? (a.bodyBytes = a.body.buffer.slice(a.body.byteOffset, a.body.byteLength + a.body.byteOffset), delete object.body) : a.body && delete a.bodyBytes, await $task.fetch(a).then(a => (a.ok = /^2dd$/.test(a.statusCode), a.status = a.statusCode, a), a => Promise.reject(a.error))
            }
        }

        time(a, b = null) {
            const d = b ? new Date(b) : new Date;
            let e = {
                "M+": d.getMonth() + 1,
                "d+": d.getDate(),
                "H+": d.getHours(),
                "m+": d.getMinutes(),
                "s+": d.getSeconds(),
                "q+": c((d.getMonth() + 3) / 3),
                S: d.getMilliseconds()
            };
            for (let c in /(y+)/.test(a) && (a = a.replace(RegExp.$1, (d.getFullYear() + "").slice(4 - RegExp.$1.length))), e) new RegExp("(" + c + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? e[c] : ("00" + e[c]).slice(("" + e[c]).length)));
            return a
        }

        getBaseURL(a) {
            return a.replace(/[?#].*$/, "")
        }

        isAbsoluteURL(a) {
            return /^[a-z][a-z0-9+.-]*:/.test(a)
        }

        getURLParameters(a) {
            return (a.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((b, a) => (b[a.slice(0, a.indexOf("="))] = a.slice(a.indexOf("=") + 1), b), {})
        }

        getTimestamp(a = new Date) {
            return c(a.getTime() / 1e3)
        }

        queryStr(a) {
            let b = [];
            for (let c in a) a.hasOwnProperty(c) && b.push(c + '=' + a[c]);
            let c = b.join("&");
            return c
        }

        queryObj(a) {
            let b = {}, c = a.split("&");
            for (let d of c) {
                let a = d.split("="), c = a[0], e = a[1] || "";
                c && (b[c] = e)
            }
            return b
        }

        msg(a = this.name, b = "", c = "", d) {
            const e = a => {
                switch (typeof a) {
                    case void 0:
                        return a;
                    case"string":
                        switch (this.platform()) {
                            case"Surge":
                            case"Stash":
                            case"Egern":
                            default:
                                return {url: a};
                            case"Loon":
                            case"Shadowrocket":
                                return a;
                            case"Quantumult X":
                                return {"open-url": a}
                        }
                    case"object":
                        switch (this.platform()) {
                            case"Surge":
                            case"Stash":
                            case"Egern":
                            case"Shadowrocket":
                            default: {
                                let b = a.url || a.openUrl || a["open-url"];
                                return {url: b}
                            }
                            case"Loon": {
                                let b = a.openUrl || a.url || a["open-url"], c = a.mediaUrl || a["media-url"];
                                return {openUrl: b, mediaUrl: c}
                            }
                            case"Quantumult X": {
                                let b = a["open-url"] || a.url || a.openUrl, c = a["media-url"] || a.mediaUrl,
                                    d = a["update-pasteboard"] || a.updatePasteboard;
                                return {"open-url": b, "media-url": c, "update-pasteboard": d}
                            }
                        }
                    default:
                }
            };
            if (!this.isMute) switch (this.platform()) {
                case"Surge":
                case"Loon":
                case"Stash":
                case"Shadowrocket":
                default:
                    $notification.post(a, b, c, e(d));
                    break;
                case"Quantumult X":
                    $notify(a, b, c, e(d))
            }
        }

        log(...a) {
            0 < a.length && (this.logs = [...this.logs, ...a]), console.log(a.join(this.logSeparator))
        }

        logErr(a, b) {
            switch (this.platform()) {
                case"Surge":
                case"Loon":
                case"Stash":
                case"Egern":
                case"Shadowrocket":
                case"Quantumult X":
                default:
                    this.log("", "❗️" + this.name + ", 错误!", a, b)
            }
        }

        wait(a) {
            return new Promise(b => setTimeout(b, a))
        }

        done(a = {}) {
            const b = new Date().getTime(), c = (b - this.startTime) / 1e3;
            switch (this.log("", "🔔" + this.name + ", 结束! 🕛" + c + "秒"), this.platform()) {
                case"Surge":
                    a.policy && this.lodash_set(a, "headers.X-Surge-Policy", a.policy), $done(a);
                    break;
                case"Loon":
                    a.policy && (a.node = a.policy), $done(a);
                    break;
                case"Stash":
                    a.policy && this.lodash_set(a, "headers.X-Stash-Selected-Proxy", encodeURI(a.policy)), $done(a);
                    break;
                case"Egern":
                    $done(a);
                    break;
                case"Shadowrocket":
                default:
                    $done(a);
                    break;
                case"Quantumult X":
                    a.policy && this.lodash_set(a, "opts.policy", a.policy), delete a["auto-redirect"], delete a["auto-cookie"], delete a["binary-mode"], delete a.charset, delete a.host, delete a.insecure, delete a.method, delete a.opt, delete a.path, delete a.policy, delete a["policy-descriptor"], delete a.scheme, delete a.sessionIndex, delete a.statusCode, delete a.timeout, a.body instanceof ArrayBuffer ? (a.bodyBytes = a.body, delete a.body) : ArrayBuffer.isView(a.body) ? (a.bodyBytes = a.body.buffer.slice(a.body.byteOffset, a.body.byteLength + a.body.byteOffset), delete a.body) : a.body && delete a.bodyBytes, $done(a)
            }
        }
    }(a, b)
  }
