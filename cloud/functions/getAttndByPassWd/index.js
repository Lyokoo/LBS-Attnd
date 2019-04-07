const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const { openId } = event.userInfo;
  const { passWd } = event;
  console.log('event', event);

  if (typeof passwd !== 'string' || !passwd) {
    return { code: 4000 };
  }

  try {
    // res = { data: [], errMsg }
    const { data } = await attndCollection.where({
      passWd: _.eq(passWd)
    }).get();
    console.log('data', data);
    if (Array.isArray(data) && data.length > 0) {
      return {
        code: 2000,
        data: {
          belonging: data[0].hostOpenId === openId,
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