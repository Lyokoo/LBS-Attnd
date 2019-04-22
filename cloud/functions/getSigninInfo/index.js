const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const signinCollection = db.collection('signin');
  const { passWd } = event;
  const { openId } = event.userInfo;
  console.log(event);

  if (typeof passWd !== 'string' || !passWd) {
    return { code: 4000 };
  }

  try {
    // res = { data:[], errMsg }
    const { data } = await signinCollection.where({
      passWd: _.eq(passWd),
      openId: _.eq(openId)
    }).get();
    console.log(data);
    if (Array.isArray(data) && data.length > 0) {
      return {
        code: 2000,
        data: data[0]
      };
    } else if (Array.isArray(data) && data.length === 0) {
      return { code: 3001 };
    } else {
      throw new Error('数据库错误');
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}