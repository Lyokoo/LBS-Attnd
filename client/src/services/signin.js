import Taro from '@tarojs/taro';
import * as adLog from '../utils/adLog';

// 签到
export const signin = async ({ passWd, location, tmpLocation }) => {
  try {
    // 获取 systemInfo
    const res = wx.getSystemInfoSync();
    const signinerSystemInfo = {
      brand: res.brand,
      model: res.model,
      platform: res.platform,
      system: res.system,
      wxVersion: res.version,
      sdkVersion: res.SDKVersion
    };

    // 打印参数
    const payload = { passWd, location, signinerSystemInfo, tmpLocation };
    adLog.log('signin-params', payload);

    const { result } = await wx.cloud.callFunction({
      name: 'signin',
      data: { passWd, location, signinerSystemInfo, tmpLocation }
    });
    if (![2000, 3002, 3003, 3004].includes(result.code)) {
      throw result;
    }
    adLog.log('signin-result', result);
    return result;
  } catch (e) {
    adLog.warn('signin-error', e);
    throw e;
  }
}

// 获取我参与的签到列表
export const getSigninListBySigninerOpenId = async ({ offset, offsetId }) => {
  const payload = { offset, offsetId };
  adLog.log('getSigninListBySigninerOpenId-params', payload);
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'getSigninListBySigninerOpenId',
      data: { offset, offsetId }
    });
    if (result.code !== 2000) {
      throw result;
    }
    adLog.log('getSigninListBySigninerOpenId-result', result);
    return result;
  } catch (e) {
    adLog.warn('getSigninListBySigninerOpenId-error', e);
    throw e;
  }
}