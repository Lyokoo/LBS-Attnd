const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const { openId } = event.userInfo;
  const { offset, offsetId, pageSize = 10 } = event;
  console.log('event', event);

  if (!Number.isInteger(offset) || offset < 0) {
    return { code: 4000 };
  }

  try {
    let query = attndCollection.where({
      hostOpenId: _.eq(openId),
      active: _.eq(true)
    }).field({
      signinerList: false
    });

    // offset 不为零时需要用 createTime 去计算偏移
    if (offsetId && offset !== 0) {
      query = attndCollection.where({
        hostOpenId: _.eq(openId),
        active: _.eq(true),
        createTime: _.lte(new Date(offsetId))
      }).field({
        signinerList: false
      });
    }

    // res = { data: [], errMsg }
    let { data } = await query.orderBy('createTime', 'desc').skip(offset).limit(pageSize).get();

    console.log(data);

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