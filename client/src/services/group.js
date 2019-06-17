import * as adLog from '../utils/adLog';

// 创建考勤组
export const createGroup = async ({ groupName }) => {
  try {
    const payload = { groupName };
    adLog.log('createGroup-params', payload);

    const { result } = await wx.cloud.callFunction({
      name: 'createGroup',
      data: { groupName }
    });
    if (result.code !== 2000 && result.code !== 3003) throw result;
    adLog.log('createGroup-result', result);
    return result;
  } catch (e) {
    adLog.warn('createGroup-error', e);
    throw e;
  }
}

// 获取小组信息
export const getGroupByPassWd = async ({ passWd, needMembers = false}) => {
  adLog.log('getGroupByPassWd-params', { passWd, needMembers });
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'getGroupByPassWd',
      data: { passWd, needMembers }
    });
    if (result.code !== 2000) throw result;
    adLog.log('getGroupByPassWd-result', result);
    return result;
  } catch (e) {
    adLog.warn('getGroupByPassWd-error', e);
    throw e;
  }
}

// 获取小组列表
export const getGroupListByOpenId = async ({ offset, offsetId }) => {
  const payload = { offset, offsetId };
  adLog.log('getGroupListByOpenId-params', payload);
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'getGroupListByOpenId',
      data: { offset, offsetId }
    });
    if (result.code !== 2000) throw result;
    adLog.log('getGroupListByOpenId-result', result);
    return result;
  } catch (e) {
    adLog.warn('getGroupListByOpenId-error', e);
    throw e;
  }
}

// 获取所有小组
export const getAllGroups = async () => {
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'getAllGroups'
    });
    if (result.code !== 2000) throw result;
    adLog.log('getAllGroups-result', result);
    return result;
  } catch (e) {
    adLog.warn('getAllGroups-error', e);
    throw e;
  }
}

// 删除小组
export const deleteGroup = async ({ passWd }) => {
  adLog.log('deleteGroup-params', { passWd });
  try {
    // 这里云函数出了 bug，无法对原来 deleteGroup 做任何操作包括删除
    // 故命名结尾加了个 p
    const { result } = await wx.cloud.callFunction({
      name: 'deleteGroupp',
      data: { passWd }
    });
    if (result.code !== 2000) throw result;
    adLog.log('deleteGroup-result', result);
  } catch (e) {
    adLog.warn('deleteGroup-error', e);
    throw e;
  }
}

// 改变小组状态
export const updateGroupStatus = async ({ passWd, groupStatus }) => {
  adLog.log('updateGroupStatus-params', { passWd, groupStatus });
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'updateGroupStatus',
      data: { passWd, groupStatus }
    });
    if (result.code !== 2000) throw result;
    adLog.log('updateGroupStatus-result', result);
    return result;
  } catch (e) {
    adLog.warn('updateGroupStatus-error', e);
    throw e;
  }
}

// 加入小组
export const joinin = async ({ passWd }) => {
  try {
    // 打印参数
    const payload = { passWd };
    adLog.log('joinin-params', payload);

    const { result } = await wx.cloud.callFunction({
      name: 'joinin',
      data: { passWd }
    });
    if (![2000, 3002, 3003].includes(result.code)) {
      throw result;
    }
    adLog.log('joinin-result', result);
    return result;
  } catch (e) {
    adLog.warn('joinin-error', e);
    throw e;
  }
}

// 删除组员
export const deleteJoiner = async ({ passWd, signinerOpenId }) => {
  adLog.log('deleteJoiner-params', { passWd, signinerOpenId });
  try {
    const { result } = await wx.cloud.callFunction({
      name: 'deleteJoiner',
      data: { passWd, signinerOpenId }
    });
    if (result.code !== 2000) throw result;
    adLog.log('deleteJoiner-result', result);
    return result;
  } catch (e) {
    adLog.warn('deleteJoiner-error', e);
    throw e;
  }
}