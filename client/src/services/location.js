import * as adLog from '../utils/adLog';

export const getLocation = async () => {
  try {
    return await new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const location = {
            lng: res.longitude,
            lat: res.latitude,
            acr: res.accuracy
          };
          adLog.log('getLocation', location);
          resolve(location);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  } catch (e) {
    adLog.warn('getLocation-error', e);
    return null;
  }
}