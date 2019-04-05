import Taro from '@tarojs/taro';
import * as adLog from '../utils/adLog';

// 创建考勤
export const createAttnd = async ({ attndName, location }) => {
  const payload = { attndName, location };
  adLog.log('createAttnd-params', payload);
  try {
    const { result } = await Taro.cloud.callFunction({
      name: 'createAttnd',
      data: { attndName, location }
    });
    if (result.code !== 2000 && result.code !== 3001) throw result;
    adLog.log('createAttnd-result', result);
    return result;
  } catch (e) {
    adLog.warn('createAttnd-error', e);
    throw e;
  }
}