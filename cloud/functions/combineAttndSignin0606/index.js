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
  const signinCollection = db.collection('signin');
  const testCollection = db.collection('test');

  // try {
  //   // await testCollection.add({
  //   //   data: {
  //   //     attndName: '计算机',
  //   //     hostName: 'plx',
  //   //     signinerList: {
  //   //       'abc': {
  //   //         name: '刘圳',
  //   //         stuId: '1506100007'
  //   //       },
  //   //       'def': {
  //   //         name: '逸鑫',
  //   //         stuId: '1506100005'
  //   //       }
  //   //     }
  //   //   }
  //   // })
  //   // const openId = 'abc';
  //   // const queryKey = `signinerList.${openId}.openId`;
  //   // const updateKey = `signinerList.${openId}`;
  //   // const { data } = await testCollection.where({
  //   //   [queryKey]: _.eq(openId)
  //   // }).update({
  //   //   data: {
  //   //     [updateKey]: {
  //   //       name: 'plx',
  //   //       stuId: '1506100006'
  //   //     }
  //   //   }
  //   // })
  //   // console.log(data);
  //   return { code: 2000 };
  // } catch (e) {
  //   console.log(e);
  //   return { code: 5000 };
  // }

  try {
    // res = { data: [], errMsg }
    const { data: attndData } = await attndCollection.get();
    const passWdSet = attndData.map(el => el.passWd);
    console.log('passWdSet', passWdSet);
    await Promise.all(passWdSet.map(async passWd => {
      try {
        const { data: signinRes } = await signinCollection.where({
          passWd: _.eq(passWd)
        }).get();
        console.log('signinRes', signinRes);
  
        const signinerList = {};
        signinRes.forEach(signinRow => {
          signinerList[signinRow.signinerOpenId] = signinRow;
        });
        console.log('signinerList', signinerList);
  
        await attndCollection.where({
          passWd: _.eq(passWd)
        }).update({
          data: {
            signinerList
          }
        });
      } catch (e) {
        console.log(e);
        return { code: 2000 };
      }
    }));
    return { code: 2000 };
  } catch (e) {
    console.log(e);
    return { code: 5000 };
  }
}