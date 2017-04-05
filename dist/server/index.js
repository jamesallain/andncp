'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongodb = require('mongodb');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphql = require('graphql');

var _utilities = require('graphql/utilities');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ip = process.env.OPENSHIFT_NODEJS_IP || null;
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var nodeEnv = process.env.NODE_ENV;
var mongourl = (process.env.MONGODB_URL || process.env.MONGO_URL) + 'vip';
var profileCollectionName = 'profile';
var userCollectionName = 'user';

var dbConnect = function dbConnect(mongourl) {
  return new Promise(function (resolve) {
    return _mongodb.MongoClient.connect(mongourl, function (err, db) {
      console.log('dbConnect: ' + mongourl);
      return resolve(db);
    });
  });
};

var dbDropIndexes = function dbDropIndexes(db) {
  return new Promise(function (resolve) {
    return db.collection(profileCollectionName).dropIndexes(function () {
      console.log('dbDropIndexes');
      return resolve(null);
    });
  });
};

var dbCreateIndex = function dbCreateIndex(db) {
  return new Promise(function (resolve) {
    return db.collection(profileCollectionName).ensureIndex({
      '$**': 'text'
    }, {
      name: 'profile_full_text',
      'default_language': 'en',
      'language_override': 'en'
    }, function () {
      console.log('dbCreateIndex');
      return resolve(null);
    });
  });
};

var schemaUpdate = function schemaUpdate(db) {
  return new Promise(function (resolve) {
    return (0, _graphql.graphql)((0, _schema.schemaGet)(db), _utilities.introspectionQuery).then(function (schema) {
      return _fs2.default.writeFile(_path2.default.join(__dirname, '../..', 'schema.json'), JSON.stringify(schema, null, 2), function () {
        console.log('schemaUpdate');
        return resolve(null);
      });
    });
  });
};

var passportUserSerializeDeserialize = function passportUserSerializeDeserialize(db) {
  _passport2.default.serializeUser(function (_ref, done) {
    var userLocalId = _ref._id;

    return done(null, userLocalId);
  });

  _passport2.default.deserializeUser(function (userLocalId, done) {
    db.collection(userCollectionName).findOne({ _id: new _mongodb.ObjectID(userLocalId) }, function (err, user) {
      return done(err, user);
    });
  });
};

var passportLocalStrategyEnable = function passportLocalStrategyEnable(db) {
  _passport2.default.use(new _passportLocal2.default.Strategy({
    usernameField: 'email'
  }, function (email, password, done) {
    db.collection(userCollectionName).findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'incorrect',
          source: 'email'
        });
      }

      if (!_bcryptjs2.default.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'incorrect',
          source: 'password'
        });
      }

      return done(null, user);
    });
  }));
};

(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var db;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return dbConnect(mongourl);

        case 2:
          db = _context.sent;
          _context.next = 5;
          return dbDropIndexes(db);

        case 5:
          _context.next = 7;
          return dbCreateIndex(db);

        case 7:
          _context.next = 9;
          return schemaUpdate(db);

        case 9:
          passportUserSerializeDeserialize(db);
          passportLocalStrategyEnable(db);

          (0, _express2.default)().set('view engine', 'ejs').use(_express2.default.static(_path2.default.join(__dirname, '../..', 'media'))).use(_express2.default.static(_path2.default.join(__dirname, '../..', 'dist/client'))).use((0, _cookieParser2.default)()).use((0, _expressSession2.default)({
            secret: 'S3CR37',
            cookie: { maxAge: 3600000 * 24 * 15 },
            store: new ((0, _connectMongo2.default)(_expressSession2.default))({ db: db }),
            resave: true,
            saveUninitialized: true
          })).use(_passport2.default.initialize()).use(_passport2.default.session()).use('/graphql', (0, _multer2.default)({ storage: _multer2.default.memoryStorage() }).single('file')).use('/graphql', (0, _expressGraphql2.default)(function (req) {
            return {
              schema: (0, _schema.schemaGet)(db),
              pretty: true,
              context: { req: req, db: db }
            };
          })).use(_bodyParser2.default.json()).use(_bodyParser2.default.urlencoded({
            extended: false
          })).get('*', function (req, res) {
            return res.render('index', {
              htmlWebpackPlugin: {
                options: {
                  title: 'vip'
                }
              }
            });
          }).listen(port, ip, function () {
            console.log('Listening at ' + (ip || 'LOCALHOST') + ':' + port + ' in ' + nodeEnv + ' mode.');
          });

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();
//# sourceMappingURL=index.js.map