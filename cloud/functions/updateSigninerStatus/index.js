const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

const SigninerStatus = {
  UN_SIGNIN: -1,
  ARRIVED: 1,
  LATE: 2,
  OUT_OF_DIST: 0
}

const AttndStatus = {
  ON: 1,
  OFF: 0
}

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const { passWd, signinerOpenId, signinerStatus } = event;
  const { openId } = event.userInfo;
  console.log('event', event);

  const signinerStatusMap = new Set(Object.values(SigninerStatus));

  if (typeof passWd !== 'string' || !passWd
    || typeof signinerOpenId !== 'string' || !signinerOpenId
    || !signinerStatusMap.has(signinerStatus)) {
    return { code: 4000 };
  }

  try {
    const updateKey = `signinerList.${signinerOpenId}`;
    const { stats: { updated } } = await attndCollection.where({
      passWd: _.eq(passWd),
      hostOpenId: _.eq(openId)
    }).update({
      data: {
        [updateKey]: {
          signinerStatus
        }
      }
    });
    console.log({ updated });
    if (updated !== 1) {
      throw new Error('更新失败');
    }
    return { code: 2000 };
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}