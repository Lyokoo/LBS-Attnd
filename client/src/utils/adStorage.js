import Taro from '@tarojs/taro';

/**
 * userInfo: { name: '', stuId: '' }
 */

// 30 天 (ms)
const ttl = 1000 * 24 * 3600 * 30;
// const ttl = 5000;

export const remove = (key) => {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.log(e);
  }
};

export const get = (key) => {
  try {
    const { data, updateTime } = wx.getStorageSync(key);
    if (!data) return null;
    if (+new Date() - updateTime > ttl) {
      remove(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

export const set = (key, data) => {
  try {
    wx.setStorageSync(key, {
      data,
      updateTime: +new Date()
    });
  } catch (e) {
    console.log(e);
  }
};
