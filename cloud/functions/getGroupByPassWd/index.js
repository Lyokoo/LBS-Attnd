const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const groupCollection = db.collection('group');
  const { openId } = event.userInfo;
  const { passWd, needMembers = false } = event;
  console.log('event', event);

  if (typeof passWd !== 'string' || !passWd) {
    return { code: 4000 };
  }

  try {
    // res = { data: [], errMsg }
    let query = null;
    if (needMembers) {
      query = groupCollection.where({
        passWd: _.eq(passWd)
      });
    } else {
      query = groupCollection.where({
        passWd: _.eq(passWd)
      }).field({
        members: false
      });
    }
    const { data } = await query.get();
    console.log('data', data);
    if (Array.isArray(data) && data.length > 0) {
      const hostOpenId = data[0].hostOpenId;
      return {
        code: 2000,
        data: {
          belonging: hostOpenId === openId,
          openId,
          ...data[0]
        }
      };
    } else if (Array.isArray(data) && data.length === 0) {
      return { code: 3001 };
    } else {
      console.log('记录的数据结构不正确');
      return { code: 5000 };
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}