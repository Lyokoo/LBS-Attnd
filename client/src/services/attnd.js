import Taro from '@tarojs/taro';
import * as adLog from '../utils/adLog';

// 创建考勤
export const createAttnd = async ({ attndName, location, gcj02Location, address, tmpLocation }) => {
  try {
    // 获取 systemInfo
    const res = wx.getSystemInfoSync();
    const hostSystemInfo = {
      brand: res.brand,
      model: res.model,
      platform: res.platform,
      system: res.system,
      wxVersion: res.version,
      sdkVersion: res.SDKVersion
    };
    
    // 打印参数
    const payload = { attndName, location, gcj02Location, address, hostSystemInfo, tmpLocation };
    adLog.log('createAttnd-params', payload);

    const { result } = await wx.cloud.callFunction({
      name: 'createAttnd',
      data: { attndName, location, gcj02Location, address, hostSystemInfo, tmpLocation }
    });
    if (result.code !== 2000 && result.code !== 3003) throw result;
    adLog.log('createAttnd-result', result);
    return result;
  } catch (e) {
    adLog.warn('createAttnd-error', e);
    throw e;
  }
}

// 根据 hostOpenId 获取考勤列表，即自己发布的考勤
export const getAttndListByHostOpenId = async ({ offset, offsetId }) => {
  const payload = { offset, offsetId };
  adLog.log('getAttndListByHostOpenId-params', payload);
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'getAttndListByHostOpenId',
      data: { offset, offsetId }
    });
    if (result.code !== 2000) throw result;
    // format 时间
    adLog.log('getAttndListByHostOpenId-result', result);
    // result.data.list = result.data.list.map(item => {
    //   item.createTime = formatDate(item.createTime);
    //   return item;
    // });
    return result;
  } catch (e) {
    adLog.warn('getAttndListByHostOpenId-error', e);
    throw e;
  }
}

// 根据口令获取单个考勤，根据 belonging 字段判断是否为自己发布的考勤
export const getAttndByPassWd = async ({ passWd, needSigninerList = false}) => {
  adLog.log('getAttndByPassWd-params', { passWd, needSigninerList });
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'getAttndByPassWd',
      data: { passWd, needSigninerList }
    });
    if (result.code !== 2000 && result.code !== 3001) throw result;
    adLog.log('getAttndByPassWd-result', result);
    return result;
  } catch (e) {
    adLog.warn('getAttndByPassWd-error', e);
    throw e;
  }
}

// 改变考勤状态
export const updateAttndStatus = async ({ passWd, attndStatus }) => {
  adLog.log('updateAttndStatus-params', { passWd, attndStatus });
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'updateAttndStatus',
      data: { passWd, attndStatus }
    });
    if (result.code !== 2000) throw result;
    adLog.log('updateAttndStatus-result', result);
    return result;
  } catch (e) {
    adLog.warn('updateAttndStatus-error', e);
    throw e;
  }
}

// 删除考勤
export const deleteAttnd = async ({ passWd }) => {
  adLog.log('deleteAttnd-params', { passWd });
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'deleteAttnd',
      data: { passWd }
    });
    if (result.code !== 2000) throw result;
    adLog.log('deleteAttnd-result', result);
  } catch (e) {
    adLog.warn('deleteAttnd-error', e);
    throw e;
  }
}