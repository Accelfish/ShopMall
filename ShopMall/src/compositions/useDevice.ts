const userAgent = window.navigator.userAgent.toLowerCase();
const devicePixelRatio = window.devicePixelRatio || 1;
const iPadOS13Up = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;

interface IDeviceDetector {
    ios: boolean;
    iphone: boolean;
    iphoneX: boolean;
    iPhoneXR: boolean;
    iPhoneXSMax: boolean;
    ipod: boolean;
    ipad: boolean;
    android: boolean;
    androidPhone: boolean;
    windows: boolean;
    mobile: boolean;
    dingding: boolean;
    wechat: boolean;
    wechatMiniApp: boolean;
}

const useDeviceDetector = () => {
    const deviceDetector: IDeviceDetector = {
        windows: find("windows"),
        ipod: find("ipod"),
        ipad: find("ipad") || iPadOS13Up,
        iphone: !find("windows") && find("iphone"),

        iphoneX: !find("windows")
            && find("iphone")
            && devicePixelRatio === 3
            && window.screen.width === 375
            && window.screen.height === 812,

        iPhoneXR: !find("windows")
            && find("iphone")
            && devicePixelRatio === 2
            && window.screen.width === 414
            && window.screen.height === 896,

        iPhoneXSMax: !find("windows")
            && find("iphone")
            && devicePixelRatio === 3
            && window.screen.width === 414
            && window.screen.height === 896,

        ios: (!find("windows")
                && find("iphone"))
            || find("ipod")
            || find("ipad")
            || iPadOS13Up,

        android: !find("windows")
            && find("android"),
        androidPhone: !find("windows")
            && find("android")
            && find("mobile"),
        mobile: (!find("windows")
                && find("android")
                && find("mobile"))
            || (!find("windows")
                && find("iphone"))
            || find("ipod"),

        dingding: find("dingtalk"),
        wechat: find("micromessenger"),
        wechatMiniApp: find("miniprogram"),
    }

    return deviceDetector;
}

const find = (needle: string) => userAgent.indexOf(needle) !== -1;

export {useDeviceDetector};
