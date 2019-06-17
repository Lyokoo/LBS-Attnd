const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const groupCollection = db.collection('group');
  const { passWd, signinerOpenId } = event;
  const { openId } = event.userInfo;
  console.log('event', event);

  if (typeof passWd !== 'string' || !passWd
    || typeof signinerOpenId !== 'string' || !signinerOpenId) {
    return { code: 4000 };
  }

  try {
    const deleteKey = `members.${signinerOpenId}`;
    const { stats: { updated } } = await groupCollection.where({
      passWd: _.eq(passWd),
      hostOpenId: _.eq(openId)
    }).update({
      data: {
        [deleteKey]: _.remove()
      }
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