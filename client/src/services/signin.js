import Taro from '@tarojs/taro';
import * as adLog from '../utils/adLog';

// 签到
export const signin = async ({ passWd, location }) => {
  const payload = { passWd, location };
  adLog.log('signin-params', payload);
  try {
    const { result } = await Taro.cloud.callFunction({
      name: 'signin',
      data: { passWd, location }
    });
    if (result.code !== 2000 && result.code !== 3002) {
      throw result;
    }
    adLog.log('signin-result', result);
    return result;
  } catch (e) {
    adLog.warn('signin-error', e);
    throw e;
  }
}

// 获取单个签到信息
export const getSigninInfo = async ({ passWd }) => {
  adLog.log('getSigninInfo-params', { passWd });
  try {
    const { result } = await Taro.cloud.callFunction({
      name: 'getSigninInfo',
      data: { passWd }
    });
    if (result.code !== 2000 && result.code !== 3001) {
      throw result;
    }
    adLog.log('getSigninInfo-result', result);
    return result;
  } catch (e) {
    adLog.warn('getSigninInfo-error', e);
    throw e;
  }
}

// 获取我参与的签到列表
export const getSigninListBySigninerOpenId = async ({ offset, offsetId }) => {
  const payload = { offset, offsetId };
  adLog.log('getSigninListBySigninerOpenId-params', payload);
  try {
    const { result } = await Taro.cloud.callFunction({
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

// 获取签到人员列表
export const getSigninerList = async ({ passWd }) => {
  adLog.log('getSigninerList-params', { passWd });
  try {
    const { result } = await Taro.cloud.callFunction({
      name: 'getSigninerList',
      data: { passWd }
    });
    if (result.code !== 2000) {
      throw result;
    }
    adLog.log('getSigninerList-result', result);
    return result;
  } catch (e) {
    adLog.warn('getSigninerList-error', e);
    throw e;
  }
}