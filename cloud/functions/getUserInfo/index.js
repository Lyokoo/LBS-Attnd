const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');

  // 可传 openId 指定需要查询的 user
  const openId = event.openId || event.userInfo.openId;

  try {
    // res = { data: [], errMsg }
    const { data } = await userCollection.field({
      name: true,
      stuId: true
    }).where({
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
      throw new Error('记录的数据结构错误');
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}