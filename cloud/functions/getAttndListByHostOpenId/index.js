const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c'
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const userCollection = db.collection('user');
  const { openId } = event.userInfo;
  const { offset, offsetId, pageSize = 10 } = event;
  console.log('event', event);

  if (!Number.isInteger(offset) || offset < 0) {
    return { code: 4000 };
  }

  try {
    let query = attndCollection.where({
      hostOpenId: _.eq(openId)
    });

    // offset 不为零时需要用 createTime 去计算偏移
    if (offsetId && offset !== 0) {
      query = attndCollection.where({
        hostOpenId: _.eq(openId),
        createTime: _.lte(new Date(offsetId))
      });
    }

    // res = { data: [], errMsg }
    let { data } = await query.orderBy('createTime', 'desc').skip(offset).limit(pageSize).get();

    console.log(data);

    // 拿 hostOpenId 查用户姓名
    // const res = await userCollection.where({
    //   openId: _.eq(openId)
    // }).get();
    // if (Array.isArray(res.data) && res.data.length > 0) {
    //   const hostName = res.data[0].name;
    //   data = data.map(item => {
    //     return {
    //       ...item,
    //       hostName
    //     }
    //   });
    // }

    let hasMore = true;

    if (Array.isArray(data)) {
      if (data.length < pageSize) {
        hasMore = false;
      }
      return {
        code: 2000,
        data: {
          hasMore,
          offsetId: offset === 0 && data[0] ? data[0].createTime : null,
          list: data
        }
      };
    } else {
      throw new Error('记录数据结构不正确');
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}