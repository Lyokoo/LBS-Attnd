import * as adLog from '../utils/adLog';
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');

export const getLocation = async (type = 'wgs84') => {
  try {
    return await new Promise((resolve, reject) => {
      wx.getLocation({
        type,
        success: res => {
          const location = {
            lng: res.longitude,
            lat: res.latitude,
            acr: res.accuracy
          };
          adLog.log('getLocation', location);
          resolve(location);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  } catch (e) {
    adLog.warn('getLocation-error', e);
    return null;
  }
}

export const getAddress = async () => {
  try {
    return await new Promise((resolve, reject) => {
      const qqmapsdk = new QQMapWX({
        key: 'N3XBZ-KHDKS-PHJOL-6M7W7-LHOAQ-JAB7L'
      });
      wx.getLocation({
        type: 'gcj02',
        success: res1 => {
          const { latitude, longitude } = res1;
          adLog.log('getLocation-gcj02', { latitude, longitude });
          qqmapsdk.reverseGeocoder({
            location: { latitude, longitude },
            success: res2 => {
              const address = res2.result.address;
              adLog.log('getAddress', address);
              resolve(address);
            },
            fail: err => {
              reject(err);
            }
          });
        },
        fail: err => {
          reject(err);
        }
      });
    });
  } catch (e) {
    adLog.warn('getAddress-error', e);
    return null;
  }
}