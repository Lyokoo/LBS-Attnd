const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c'
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');
  const attndCollection = db.collection('attnd');
  const signinCollection = db.collection('signin');
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
    }

    // 更新 attnd 表的个人信息
    // res = { data: [], errMsg }
    const attndRes = await attndCollection.where({
      hostOpenId: _.eq(openId)
    }).update({
      data: {
        hostName: name,
        updateTime: new Date()
      }
    });
    console.log('attndRes', attndRes);

    // 更新 signin 表的个人信息
    // res = { data: [], errMsg }
    const signinRes = await signinCollection.where({
      signinerOpenId: _.eq(openId)
    }).update({
      data: {
        signinerName: name,
        signinerStuId: stuId,
        updateTime: new Date()
      }
    });
    console.log('signinRes', signinRes);

    return { code: 2000 };
  } catch (e) {
    // {"errCode":-502001,"errMsg":"云资源数据库错误：数据库请求失败 "}
    console.log(e);
    if (typeof e === 'object' && e.errCode === -502001) {
      return { code: 5001, msg: e };
    }
    return { code: 5000, msg: e };
  }
}