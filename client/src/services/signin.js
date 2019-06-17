import * as adLog from '../utils/adLog';

// 签到
export const signin = async ({ passWd, location }) => {
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
    const payload = { passWd, location, signinerSystemInfo };
    adLog.log('signin-params', payload);

    const { result } = await wx.cloud.callFunction({
      name: 'signin',
      data: { passWd, location, signinerSystemInfo }
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

// 更新签到状态
export const updateSigninerStatus = async ({ passWd, signinerOpenId, signinerStatus }) => {
  const payload = { passWd, signinerOpenId, signinerStatus };
  adLog.log('updateSigninerStatus-params', payload);
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'updateSigninerStatus',
      data: { passWd, signinerOpenId, signinerStatus }
    });
    if (result.code !== 2000) {
      throw result;
    }
    adLog.log('updateSigninerStatus-result', result);
    return result;
  } catch (e) {
    adLog.warn('updateSigninerStatus-error', e);
    throw e;
  }
}