const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');
  const { name, stuId } = event;
  const { openId } = event.userInfo;
  console.log('event', event);
  if (!name) {
    return { code: 4000, msg: '用户名不能为空' };
  }

  try {
    // res = { data: [], errMsg }
    let { data } = await userCollection.where({
      openId: _.eq(openId)
    }).get();

    // 不存在该记录，插入之
    if (Array.isArray(data) && data.length === 0) {
      await userCollection.add({
        data: {
          openId,
          name,
          stuId,
          createTime: new Date(),
          updateTime: new Date()
        }
      });
      return { code: 2000 };
    }

    // 存在该记录，更新之
    if (Array.isArray(data) && data.length > 0) {
      let result = await userCollection.where({
        openId: _.eq(openId)
      }).update({
        data: {
          name,
          stuId,
          updateTime: new Date()
        }
      });
      console.log(result);
      return { code: 2000 };
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}