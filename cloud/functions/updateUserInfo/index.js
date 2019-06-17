const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');
  const attndCollection = db.collection('attnd');
  const groupCollection = db.collection('group');
  const { name, stuId } = event;
  const { openId } = event.userInfo;
  console.log('event', event);
  if (!name) {
    return { code: 4000, msg: '用户名不能为空' };
  }

  try {
    // 文字内容合法性检测
    const { errCode: p1Code } = await cloud.openapi.security.msgSecCheck({
      content: name
    });
    if (p1Code === 87014) {
      throw new Error('内容含有违法违规内容');
    }
    if (stuId) {
      const { errCode: p2Code } = await cloud.openapi.security.msgSecCheck({
        content: stuId
      });
      if (p2Code === 87014) {
        throw new Error('内容含有违法违规内容');
      }
    }

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

    // 更新 attnd 表的 host 个人信息
    const { stats: { updated: attndUpdated } } = await attndCollection.where({
      hostOpenId: _.eq(openId)
    }).update({
      data: {
        hostName: name,
        updateTime: new Date()
      }
    });

    // 更新 group 表到 host 个人信息
    const { stats: { updated: groupUpdated } } = await groupCollection.where({
      hostOpenId: _.eq(openId)
    }).update({
      data: {
        hostName: name,
        updateTime: new Date()
      }
    });

    // 更新 signinerList 中的个人信息
    const signinerOpenId = `signinerList.${openId}.signinerOpenId`;
    const updateKey = `signinerList.${openId}`;
    const { stats: { updated: signinUpdated } } = await attndCollection.where({
      [signinerOpenId]: _.eq(openId)
    }).update({
      data: {
        [updateKey]: {
          signinerName: name,
          signinerStuId: stuId,
          updateTime: new Date()
        }
      }
    });

    // 更新 members 中到个人信息
    const signinerOpenId2 = `members.${openId}.signinerOpenId`;
    const updateKey2 = `members.${openId}`;
    const { stats: { updated: joininUpdated } } = await groupCollection.where({
      [signinerOpenId2]: _.eq(openId)
    }).update({
      data: {
        [updateKey2]: {
          signinerName: name,
          signinerStuId: stuId,
          updateTime: new Date()
        }
      }
    });

    console.log({ attndUpdated, signinUpdated, groupUpdated, joininUpdated });

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