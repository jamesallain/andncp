'use strict';

import path from 'path';
import {MongoClient, ObjectID} from 'mongodb';
import express from 'express';
import expressGraphql from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import fs from 'fs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcryptjs from 'bcryptjs';
import multer from 'multer';

import {schemaGet} from './schema';

const ip = process.env.OPENSHIFT_NODEJS_IP ||
  null;
const port = process.env.OPENSHIFT_NODEJS_PORT ||
  3000;
const nodeEnv = process.env.NODE_ENV;
const mongourl = `${process.env.MONGODB_URL ||
  process.env.MONGO_URL}vip`;
const profileCollectionName = 'profile';
const userCollectionName = 'user';
const postCollectionName = 'post';
const commentCollectionName = 'comment';

const dbConnect = (mongourl) => {
  return new Promise((resolve) => {
    return MongoClient.connect(
      mongourl,
      (err, db) => {
        console.log(`dbConnect: ${mongourl}`);
        return resolve(db);
      }
    );
  });
};

const dbProfileDropIndexes = (db) => {
  return new Promise((resolve) => {
    return db.collection(profileCollectionName)
      .dropIndexes(
        () => {
          console.log('dbProfileDropIndexes');
          return resolve(null);
        }
      );
  });
};

const dbProfileCreateIndex = (db) => {
  return new Promise((resolve) => {
    return db.collection(profileCollectionName)
      .ensureIndex(
        ({
          '$**': 'text'
        }),
        ({
          name: 'profile_full_text',
          'default_language': 'en',
          'language_override': 'en'
        }),
        () => {
          console.log('dbProfileCreateIndex');
          return resolve(null);
        }
      );
  });
};

const dbPostDropIndexes = (db) => {
  return new Promise((resolve) => {
    return db.collection(postCollectionName)
      .dropIndexes(
        () => {
          console.log('dbPostDropIndexes');
          return resolve(null);
        }
      );
  });
};

const dbPostCreateIndex = (db) => {
  return new Promise((resolve) => {
    return db.collection(postCollectionName)
      .ensureIndex(
        ({
          '$**': 'text'
        }),
        ({
          name: 'post_full_text',
          'default_language': 'en',
          'language_override': 'en'
        }),
        () => {
          console.log('dbPostCreateIndex');
          return resolve(null);
        }
      );
  });
};

const dbCommentDropIndexes = (db) => {
  return new Promise((resolve) => {
    return db.collection(commentCollectionName)
      .dropIndexes(
        () => {
          console.log('dbCommentDropIndexes');
          return resolve(null);
        }
      );
  });
};

const dbCommentCreateIndex = (db) => {
  return new Promise((resolve) => {
    return db.collection(commentCollectionName)
      .ensureIndex(
        ({
          '$**': 'text'
        }),
        ({
          name: 'comment_full_text',
          'default_language': 'en',
          'language_override': 'en'
        }),
        () => {
          console.log('dbPCommentCreateIndex');
          return resolve(null);
        }
      );
  });
};

const schemaUpdate = (db) => {
  return new Promise((resolve) => {
    return graphql(
      schemaGet(db),
      introspectionQuery
    )
      .then((schema) => {
        return fs.writeFile(
          path.join(__dirname, '../..', 'schema.json'),
          JSON.stringify(schema, null, 2),
          () => {
            console.log('schemaUpdate');
            return resolve(null);
          }
        );
      });
  });
};

const passportUserSerializeDeserialize = (db) => {
  passport.serializeUser(({_id: userLocalId}, done) => {
    return done(null, userLocalId);
  });

  passport.deserializeUser((userLocalId, done) => {
    db.collection(userCollectionName)
      .findOne(
        {_id: new ObjectID(userLocalId)},
        (err, user) => {
          return done(err, user);
        }
      );
  });
};

const passportLocalStrategyEnable = (db) => {
  passport.use(
    new passportLocal.Strategy(
      {
        usernameField: 'email'
      },
      (email, password, done) => {
        db.collection(userCollectionName)
          .findOne(
            {email},
            (err, user) => {
              if (err) {
                return done(err);
              }

              if (!user) {
                return done(
                  null,
                  false,
                  {
                    message: 'incorrect',
                    source: 'email'
                  }
                );
              }

              if (!bcryptjs.compareSync(password, user.password)) {
                return done(
                  null,
                  false,
                  {
                    message: 'incorrect',
                    source: 'password'
                  }
                );
              }

              return done(null, user);
            }
          );
      }
    )
  );
};

(async () => {
  const db = await dbConnect(mongourl);
  await dbProfileDropIndexes(db);
  await dbProfileCreateIndex(db);
  await dbPostDropIndexes(db);
  await dbPostCreateIndex(db);
  await dbCommentDropIndexes(db);
  await dbCommentCreateIndex(db);
  await schemaUpdate(db);
  passportUserSerializeDeserialize(db);
  passportLocalStrategyEnable(db);

  express()

    .set('view engine', 'ejs')

    .use(express.static(path.join(__dirname, '../..', 'media')))
    .use(express.static(path.join(__dirname, '../..', 'dist/client')))

    .use(cookieParser())
    .use(expressSession({
      secret: 'S3CR37',
      cookie: {maxAge: 3600000 * 24 * 15},
      store: new (connectMongo(expressSession))({db}),
      resave: true,
      saveUninitialized: true
    }))

    .use(passport.initialize())
    .use(passport.session())

    .use('/graphql', multer({storage: multer.memoryStorage()}).single('file'))

    .use('/graphql', expressGraphql((req) => {
      return {
        schema: schemaGet(db),
        pretty: true,
        context: {req, db},
        graphiql: true
      };
    }))

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
      extended: false
    }))

    .get('*', (req, res) => {
      return res.render(
        'index',
        {
          htmlWebpackPlugin: {
            options: {
              title: 'vip'
            }
          }
        }
      );
    })

    .listen(port, ip, () => {
      console.log(`Listening at ${ip || 'LOCALHOST'}:${port} in ${nodeEnv} mode.`);
    });
})();
