const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const groupCollection = db.collection('group');
  const { passWd, groupStatus } = event;
  const { openId } = event.userInfo;
  console.log('event', event);
  const statusSet = new Set([0, 1]);

  if (typeof passWd !== 'string' || !passWd
    || typeof groupStatus !== 'number' || !statusSet.has(groupStatus)) {
    return { code: 4000 };
  }

  try {
    const { stats: { updated } } = await groupCollection.where({
      passWd: _.eq(passWd),
      hostOpenId: _.eq(openId),
      active: true
    }).update({
      data: { groupStatus }
    });
    console.log({ updated });
    if (updated !== 1) {
      throw new Error('更新失败');
    }
    return { code: 2000 };
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}