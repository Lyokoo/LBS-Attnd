const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c'
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const signinCollection = db.collection('signin');
  const userCollection = db.collection('user');
  const { openId } = event.userInfo;
  const { offset, offsetId, pageSize = 10 } = event;
  let hasMore = true;
  console.log('event', event);

  if (!Number.isInteger(offset) || offset < 0) {
    return { code: 4000 };
  }

  try {
    // 先获取 passWd 数组
    // res = { data:[], errMsg }
    let query = signinCollection.where({
      signinerOpenId: _.eq(openId)
    });

    // offset 不为零时需要用 _id 去计算偏移
    if (offsetId && offset !== 0) {
      query = signinCollection.where({
        signinerOpenId: _.eq(openId),
        _id: _.lte(offsetId)
      });
    }

    // res = { data: [], errMsg }
    const signinRes = await query.orderBy('updateTime', 'desc').orderBy('_id', 'desc').skip(offset).limit(pageSize).get();
    console.log('signinRes', signinRes);
    const passWdSet = signinRes.data.map(el => el.passWd);
    console.log('passWdSet', passWdSet);

    const signinListData = await Promise.all(passWdSet.map(async (passWd) => {
      try {
        // res = { data: [], errMsg }
        const { data } = await attndCollection.where({
          passWd: _.eq(passWd)
        }).get();

        // 根据 hostOpenId 获取发布者名称
        if (data.length > 0) {
          return data[0];
          // const hostOpenId = data[0].hostOpenId;
          // const userRes = await userCollection.where({
          //   openId: _.eq(hostOpenId)
          // }).get();
          // if (userRes.data.length > 0) {
          //   return {
          //     ...data[0],
          //     hostName: userRes.data[0].name
          //   }
          // }
        }
        return {};
      } catch (e) {
        throw e;
      }
    }));

    console.log('signinListData', signinListData);

    if (signinListData.length < pageSize) {
      hasMore = false;
    }

    return {
      code: 2000,
      data: {
        hasMore,
        offsetId: offset === 0 && signinRes.data[0] ? signinRes.data[0]._id : null,
        list: signinListData
      }
    }

  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}