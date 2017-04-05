'use strict';

import {MongoClient, ObjectID} from 'mongodb';
import co from 'co';

const mongourl = `${process.env.MONGODB_URL ||
  process.env.MONGO_URL}vip`;
const profileCollectionName = 'profile';

const dbConnect = (mongourl) => {
  return new Promise((resolve) => {
    return MongoClient.connect(mongourl, (err, db) => {
      console.log(`dbConnect- mongourl: ${mongourl}`);
      return resolve(db);
    });
  });
};

const profilesGet = (db) => {
  return new Promise((resolve) => {
    return db.collection(profileCollectionName)
      .find({})
      .toArray((err, profiles) => {
        return resolve(profiles);
      });
  });
};

const profileUpdateObjGet = (profile) => {
  const [ , region, country] = profile.locality.split(',');

  return {
    ...profile,
    currentCompany: profile.curentCompany[0],
    educationTitle: (profile.educations.length &&
      profile.educations[0].title) ?
      profile.educations[0].title :
      'unknown',
    country,
    region
  };
};

const profileUpdate = (profileUpdateObj, db) => {
  const {
    _id,
    ...profileSetObj
  } = profileUpdateObj;

  return new Promise((resolve) => {
    return db.collection(profileCollectionName)
      .findAndModify(
        {_id: new ObjectID(_id)},
        [],
        {$set: profileSetObj},
        {new: true},
        (err,  {value: profile}) => {
          return resolve(profile);
        }
      );
  });
};

const profileProcess = (profile, db) => {
  return co(
    function*() {
      const profileUpdateObj = profileUpdateObjGet(profile);
      const profileUpdated = yield profileUpdate(profileUpdateObj, db);

      return profileUpdated;
    }
  );
};

const profilesProcess = (profiles, db) => {
  return profiles
    .reduce((memo, profile) => {
      return memo.then((res) => {
        return profileProcess(profile, db)
          .then((result) => {
            return Promise.resolve([
              ...res,
              result
            ]);
          });
      });
    }, Promise.resolve([]));
};

(async () => {
  const db = await dbConnect(mongourl);

  const profiles = await profilesGet(db);

  return profilesProcess(profiles, db)

  .then(() => {
    console.log('DONE!');
  });
})();
