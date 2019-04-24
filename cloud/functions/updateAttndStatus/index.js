const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const { passWd, attndStatus } = event;
  const { openId } = event.userInfo;
  console.log('event', event);
  const statusSet = new Set([0, 1]);

  if (typeof passWd !== 'string' || !passWd
    || typeof attndStatus !== 'number' || !statusSet.has(attndStatus)) {
    return { code: 4000 };
  }

  try {
    // res = { data: [], errMsg }
    const { data } = await attndCollection.where({
      passWd: _.eq(passWd),
      hostOpenId: _.eq(openId)
    }).get();

    // 存在该记录，更新之
    if (Array.isArray(data) && data.length > 0) {
      await attndCollection.where({
        passWd: _.eq(passWd),
        hostOpenId: _.eq(openId)
      }).update({
        data: { attndStatus }
      });
      return { code: 2000 };
    } else {
      throw new Error('不存在该记录');
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}