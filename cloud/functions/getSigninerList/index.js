const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const userCollection = db.collection('user');
  const signinCollection = db.collection('signin');
  const { passWd } = event;
  console.log('event', event);

  if (typeof passWd !== 'string' || !passWd) {
    return { code: 4000 };
  }

  try {
    // res = { data: [], errMsg }
    const signinRes = await signinCollection.where({
      passWd: _.eq(passWd)
    }).get();

    const signinerList = await Promise.all(signinRes.data.map(async row => {
      try {
        const { signinerOpenId, signinerStatus, signinerLocation, distance } = row;
        const userRes = await userCollection.where({
          openId: _.eq(signinerOpenId)
        }).get();
        const { name, stuId } = userRes.data[0] || {};
        return {
          signinerOpenId, signinerStatus, signinerLocation, distance, name, stuId
        };
      } catch (e) {
        throw e;
      }
    }));

    return {
      code: 2000,
      data: signinerList
    }
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}