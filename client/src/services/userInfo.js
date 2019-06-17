import * as adStorage from '../utils/adStorage';
import * as adLog from '../utils/adLog';

export const updateUserInfo = async ({ name, stuId }) => {
  const payload = { name, stuId };
  adLog.log('updateUserInfo-params', payload);
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: { ...payload }
    });
    if (result.code !== 2000) {
      throw result;
    }
    adLog.log('updateUserInfo-set', payload);
    // 更新缓存
    adStorage.set('userInfo', payload);
    adLog.log('updateUserInfo-setStorage', payload);
  } catch (e) {
    adLog.warn('updateUserInfo-error', e);
    throw e;
  }
}

export const getUserInfo = async (isFromStorage = false) => {
  
  // 从缓存获取
  if (isFromStorage) {
    const userInfo = adStorage.get('userInfo');
    if (userInfo) {
      const result = {
        code: 2000,
        data: userInfo
      };
      adLog.log('getUserInfo-getStorage', result);
      return result;
    }
  }

  // 从数据库获取
  try {
    // result: { code: 2000, data: { name: 'Lyokoo', stuId: '123' } }
    const { result } = await wx.cloud.callFunction({
      name: 'getUserInfo'
    });
    if (result.code !== 2000 && result.code !== 3001) {
      throw result;
    }
    const { data } = result;
    adLog.log('getUserInfo-getFromDB', data);

    // 更新缓存
    if (result.code === 2000) {
      adStorage.set('userInfo', data);
      adLog.log('getUserInfo-setStorage', data);
    }

    return result;
  } catch (e) {
    adLog.warn('getUserInfo-error', e);
    throw e;
  }
}