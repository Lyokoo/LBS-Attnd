const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const userCollection = db.collection('user');
  const { openId } = event.userInfo;
  const { passWd } = event;
  console.log('event', event);

  if (typeof passWd !== 'string' || !passWd) {
    return { code: 4000 };
  }

  try {
    // res = { data: [], errMsg }
    const { data } = await attndCollection.where({
      passWd: _.eq(passWd)
    }).get();
    console.log('data', data);
    if (Array.isArray(data) && data.length > 0) {
      const hostOpenId = data[0].hostOpenId;
      // 拿 hostOpenId 查用户姓名
      const res = await userCollection.where({
        openId: _.eq(hostOpenId)
      }).get();
      let hostName = '';
      if (Array.isArray(res.data) && res.data.length > 0) {
        hostName = res.data[0].name;
      }
      return {
        code: 2000,
        data: {
          belonging: hostOpenId === openId,
          hostName,
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