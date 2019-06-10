const cloud = require('wx-server-sdk');
cloud.init({
  env: 'envlzp-110d2c',
  // env: 'devlzp-8cqxl',
});

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const noticeCollection = db.collection('notice');
  const { type } = event;

  try {
    // res = { data: {}, errMsg }
    const { data } = await noticeCollection.doc(type).get();
    return { code: 2000, data };
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}