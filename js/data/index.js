'use strict';

import path from 'path';
import fs from 'fs';
import co from 'co';
import ScrapeLinkedin from 'scrape-linkedin';
import {MongoClient, ObjectID} from 'mongodb';

const linkedinProfileLinksFile = path.join(__dirname, 'linkedinProfileLinks.json');
const mongourl = `${process.env.MONGODB_URL ||
  process.env.MONGO_URL}vip`;
const profileCollectionName = 'profile';

const dbConnect = (mongourl) => {
  return new Promise((resolve) => {
    return MongoClient.connect(mongourl, (err, db) => {
      console.log(`dbConnect: ${mongourl}`);
      return resolve(db);
    });
  });
};

const dbClear = (profileCollectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(profileCollectionName)
      .remove({}, () => {
        console.log(`dbClear: ${profileCollectionName}`);
        return resolve(null);
      });
  });
};

const linkedinProfileLinksGet = (linkedinProfileLinksFile) => {
  return new Promise((resolve) => {
    return fs.readFile(
      linkedinProfileLinksFile,
      'utf-8',
      (err, linkedinProfileLinks) => {
        return resolve(JSON.parse(linkedinProfileLinks));
      }
    );
  });
};

const linkedinProfileGetFn = (linkedinProfileLink) => {
  return new ScrapeLinkedin().fetch(linkedinProfileLink.split('/')[2])
    .then((res) => {
      console.log(`SUCCESS: ${linkedinProfileLink}`);
      return res;
    })
    .catch(() => {
      console.log(`CATCH: linkedinProfileInsert: ${linkedinProfileLink}`);
      return Promise.resolve(null);
    });
};

const linkedinProfileInsert = (linkedinProfile, profileCollectionName, db) => {
  return new Promise((resolve) => {
    return db
      .collection(profileCollectionName)
      .findAndModify(
        {_id: new ObjectID()},
        [],
        ({
          $set: linkedinProfile
        }),
        ({
          upsert: true,
          new: true
        }),
        (err, linkedinProfileEntity) => {
          return resolve(linkedinProfileEntity);
        }
      );
  })
  .catch(() => {
    console.log(`CATCH: linkedinProfileInsert: ${linkedinProfile.fullName}`);
    return Promise.resolve(null);
  });
};

const linkedinProfileGet = (linkedinProfileLink, profileCollectionName, db) => {
  return co(
    function*() {
      const linkedinProfile = yield linkedinProfileGetFn(linkedinProfileLink);

      const linkedinProfileEntity = linkedinProfileInsert(
        linkedinProfile,
        profileCollectionName,
        db
      );

      return linkedinProfileEntity;
    }
  );
};

const linkedinProfilesGet = (linkedinProfileLinks, profileCollectionName, db) => {
  return linkedinProfileLinks
    .reduce((memo, linkedinProfileLink) => {
      return memo.then((res) => {
        return linkedinProfileGet(linkedinProfileLink, profileCollectionName, db)
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
  await dbClear(profileCollectionName, db);

  return linkedinProfileLinksGet(linkedinProfileLinksFile)

    .then((linkedinProfileLinks) => {
      return linkedinProfilesGet(
        linkedinProfileLinks,
        profileCollectionName,
        db
      );
    })
    .then((linkedinProfiles) => {
      console.log(`DONE: ${linkedinProfiles.length}`);
    });
})();
