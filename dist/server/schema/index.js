'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaGet = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _mongodb = require('mongodb');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _emailValidator = require('email-validator');

var _emailValidator2 = _interopRequireDefault(_emailValidator);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _passwordGenerator = require('password-generator');

var _passwordGenerator2 = _interopRequireDefault(_passwordGenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mailer = require('../mailer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extendableBuiltin3(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var _db = void 0;
var profileCollectionName = 'profile';
var userCollectionName = 'user';

var entityGet = function entityGet(query, collectionName, db) {
  return new Promise(function (resolve) {
    return db.collection(collectionName).findOne(query, function (err, entity) {
      return resolve(entity);
    });
  });
};

var promisedArrayGet = function promisedArrayGet(query, sort, limit, collectionName, db) {
  return new Promise(function (resolve) {
    return db.collection(collectionName).find(query).sort(sort).limit(limit).toArray(function (err, entities) {
      return resolve(entities);
    });
  });
};

var inputPresentCheck = function inputPresentCheck(input) {
  return Object.keys(input).reduce(function (memo, key) {
    if (!memo) {
      if (!input[key]) {
        return {
          message: 'input required',
          source: key
        };
      }

      return null;
    }

    return memo;
  }, null);
};

var emailValidCheck = function emailValidCheck(email) {
  return _emailValidator2.default.validate(email) ? null : {
    message: 'invalid',
    source: 'email'
  };
};

var entityCountGet = function entityCountGet(query, collectionName, db) {
  return new Promise(function (resolve) {
    return db.collection(collectionName).find(query).count(function (err, count) {
      return resolve(count);
    });
  });
};

var userUniqueCheck = function userUniqueCheck(email, db) {
  return entityCountGet({ email: email }, userCollectionName, db).then(function (count) {
    if (count) {
      return {
        message: 'registered',
        source: 'email'
      };
    }

    return null;
  });
};

var userRegisteredCheck = function userRegisteredCheck(email, db) {
  return entityCountGet({ email: email }, userCollectionName, db).then(function (count) {
    if (!count) {
      return {
        message: 'not registered',
        source: 'email'
      };
    }

    return null;
  });
};

var passwordHash = function passwordHash(password) {
  var salt = _bcryptjs2.default.genSaltSync(4);
  return _bcryptjs2.default.hashSync(password, salt);
};

var passwordGenerate = function passwordGenerate() {
  return (0, _passwordGenerator2.default)();
};

var isSignedinCheck = function isSignedinCheck(req) {
  return !req.user ? {
    message: 'not signedin',
    source: 'auth'
  } : null;
};

var isTheUserCheck = function isTheUserCheck(userGlobalId, _userId) {
  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(userGlobalId),
      userLocalId = _fromGlobalId.id;

  return userLocalId.toString() !== _userId.toString() ? {
    message: 'not authorised',
    source: 'auth'
  } : null;
};

var isCreatorCheck = function isCreatorCheck(profileGlobalId, _profileId) {
  var _fromGlobalId2 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
      profileLocalId = _fromGlobalId2.id;

  return profileLocalId.toString() !== _profileId.toString() ? {
    message: 'not authorised',
    source: 'auth'
  } : null;
};

var Viewer = function (_extendableBuiltin2) {
  (0, _inherits3.default)(Viewer, _extendableBuiltin2);

  function Viewer() {
    (0, _classCallCheck3.default)(this, Viewer);
    return (0, _possibleConstructorReturn3.default)(this, (Viewer.__proto__ || Object.getPrototypeOf(Viewer)).apply(this, arguments));
  }

  return Viewer;
}(_extendableBuiltin(Object));

var viewerGet = function viewerGet() {
  return Object.assign(new Viewer(), {
    _id: 'Viewer'
  });
};

var Profile = function (_extendableBuiltin4) {
  (0, _inherits3.default)(Profile, _extendableBuiltin4);

  function Profile() {
    (0, _classCallCheck3.default)(this, Profile);
    return (0, _possibleConstructorReturn3.default)(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).apply(this, arguments));
  }

  return Profile;
}(_extendableBuiltin3(Object));

var profileGet = function profileGet(profileLocalId) {
  return entityGet(profileLocalId, profileCollectionName, _db).then(function (profile) {
    return Object.assign(new Profile(), profile);
  });
};

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId3 = (0, _graphqlRelay.fromGlobalId)(globalId),
      localId = _fromGlobalId3.id,
      type = _fromGlobalId3.type;

  switch (type) {
    case 'Viewer':
      return viewerGet(localId);
    case 'Profile':
      return profileGet(localId);
    default:
      return null;
  }
}, function (obj) {
  switch (true) {
    case obj instanceof Viewer:
      return viewerType;
    case obj instanceof Profile:
      return profileType;
    default:
      return null;
  }
}),
    nodeInterface = _nodeDefinitions.nodeInterface,
    nodeField = _nodeDefinitions.nodeField;

var languageType = new _graphql.GraphQLObjectType({
  name: 'Language',
  fields: function fields() {
    return {
      language: { type: _graphql.GraphQLString },
      level: { type: _graphql.GraphQLString }
    };
  }
});

var skillType = new _graphql.GraphQLObjectType({
  name: 'Skill',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Skill', function (_ref) {
        var skillLocalId = _ref._id;

        return skillLocalId;
      }),
      _id: { type: _graphql.GraphQLID },
      name: { type: _graphql.GraphQLString },
      recommendations: { type: _graphql.GraphQLString }
    };
  }
});

var experienceType = new _graphql.GraphQLObjectType({
  name: 'Experience',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Experience', function (_ref2) {
        var experienceLocalId = _ref2._id;

        return experienceLocalId;
      }),
      _id: { type: _graphql.GraphQLID },
      company: { type: _graphql.GraphQLString },
      description: { type: _graphql.GraphQLString },
      country: { type: _graphql.GraphQLString },
      region: { type: _graphql.GraphQLString },
      location: { type: _graphql.GraphQLString },
      since: { type: _graphql.GraphQLString },
      title: { type: _graphql.GraphQLString },
      until: { type: _graphql.GraphQLString }
    };
  }
});

var educationType = new _graphql.GraphQLObjectType({
  name: 'Education',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Education', function (_ref3) {
        var educationLocalId = _ref3._id;

        return educationLocalId;
      }),
      _id: { type: _graphql.GraphQLID },
      major: { type: _graphql.GraphQLString },
      date: { type: _graphql.GraphQLString },
      degree: { type: _graphql.GraphQLString },
      title: { type: _graphql.GraphQLString }
    };
  }
});

var profileType = new _graphql.GraphQLObjectType({
  name: 'Profile',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Profile', function (_ref4) {
        var profileLocalId = _ref4._id;

        return profileLocalId;
      }),
      _id: { type: _graphql.GraphQLID },
      fullName: { type: _graphql.GraphQLString },
      industry: { type: _graphql.GraphQLString },
      languages: { type: new _graphql.GraphQLList(languageType) },
      previousCompanies: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
      profilePicture: { type: _graphql.GraphQLString },
      skills: { type: new _graphql.GraphQLList(skillType) },
      title: { type: _graphql.GraphQLString },
      experiences: { type: new _graphql.GraphQLList(experienceType) },
      educations: { type: new _graphql.GraphQLList(educationType) },
      currentCompany: { type: _graphql.GraphQLString },
      educationTitle: { type: _graphql.GraphQLString },
      country: { type: _graphql.GraphQLString },
      region: { type: _graphql.GraphQLString }
    };
  },

  interfaces: [nodeInterface]
});

var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({
  name: 'Profile',
  nodeType: profileType
}),
    profileConnectionType = _connectionDefinition.connectionType;

var userType = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('User', function (_ref5) {
        var userLocalId = _ref5._id;

        return userLocalId;
      }),
      _id: { type: _graphql.GraphQLID },
      email: { type: _graphql.GraphQLString },
      password: { type: _graphql.GraphQLString },
      profileId: (0, _graphqlRelay.globalIdField)('Profile', function (_ref6) {
        var profileLocalId = _ref6._profileId;

        return profileLocalId;
      }),
      _profileId: { type: _graphql.GraphQLID }
    };
  }
});

var viewerType = new _graphql.GraphQLObjectType({
  name: 'Viewer',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Viewer', function (_ref7) {
        var viewerLocalId = _ref7._id;

        return viewerLocalId;
      }),
      _id: { type: _graphql.GraphQLID },
      user: {
        type: userType,
        resolve: function resolve(parent, args, _ref8) {
          var user = _ref8.req.user;

          return user || {};
        }
      },
      profile: {
        type: profileConnectionType,
        args: (0, _extends3.default)({
          id: { type: _graphql.GraphQLID },
          searchTerm: { type: _graphql.GraphQLString }
        }, _graphqlRelay.connectionArgs),
        resolve: function resolve(parent, _ref9, _ref10) {
          var profileGlobalId = _ref9.id,
              searchTerm = _ref9.searchTerm,
              connectionArgs = (0, _objectWithoutProperties3.default)(_ref9, ['id', 'searchTerm']);
          var db = _ref10.db;

          var query = function () {
            var q = {};

            if (profileGlobalId) {
              var _fromGlobalId4 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
                  profileLocalId = _fromGlobalId4.id;

              Object.assign(q, { _id: new _mongodb.ObjectID(profileLocalId) });
            }

            if (searchTerm) {
              Object.assign(q, {
                $text: {
                  $search: '"' + searchTerm + '"'
                }
              });
            }

            return q;
          }();
          var sort = { _id: -1 };
          var limit = 0;

          return (0, _graphqlRelay.connectionFromPromisedArray)(promisedArrayGet(query, sort, limit, profileCollectionName, db), connectionArgs);
        }
      }
    };
  },

  interfaces: [nodeInterface]
});

var queryType = new _graphql.GraphQLObjectType({
  name: 'Query',
  fields: function fields() {
    return {
      node: nodeField,
      viewer: {
        type: viewerType,
        resolve: function resolve() {
          return viewerGet();
        }
      }
    };
  }
});

var UserCreateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UserCreate',
  inputFields: {
    email: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    password: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref11, _ref12) {
    var _this3 = this;

    var email = _ref11.email,
        password = _ref11.password;
    var db = _ref12.db,
        req = _ref12.req;
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var err, _profileId;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              err = void 0;

              if (!(err = inputPresentCheck({ email: email, password: password }))) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', new _graphql.GraphQLError(err));

            case 3:
              if (!(err = emailValidCheck(email))) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return', new _graphql.GraphQLError(err));

            case 5:
              _context.next = 7;
              return userUniqueCheck(email, db);

            case 7:
              if (!(err = _context.sent)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return', new _graphql.GraphQLError(err));

            case 9:
              _profileId = new _mongodb.ObjectID();
              return _context.abrupt('return', new Promise(function (resolve) {
                return db.collection(profileCollectionName).findAndModify({ _id: _profileId }, [], {
                  $set: {
                    fullName: null,
                    industry: null,
                    languages: [],
                    previousCompanies: [],
                    profilePicture: null,
                    skills: [],
                    title: null,
                    experiences: [],
                    educations: [],
                    currentCompany: null,
                    educationTitle: null,
                    country: null,
                    region: null
                  }
                }, {
                  upsert: true,
                  new: true
                }, function (err, _ref13) {
                  var profile = _ref13.value;

                  return resolve(profile);
                });
              }).then(function () {
                return new Promise(function (resolve) {
                  return db.collection(userCollectionName).findAndModify({ _id: new _mongodb.ObjectID() }, [], {
                    $set: {
                      email: email,
                      password: passwordHash(password),
                      _profileId: _profileId
                    }
                  }, {
                    upsert: true,
                    new: true
                  }, function (err, _ref14) {
                    var user = _ref14.value;

                    req.logIn(user, function () {
                      (0, _mailer.userCrudMailSend)('userCreate', email, password);
                      return resolve(user);
                    });
                  });
                });
              }));

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this3);
    }))();
  }
});

var UserUpdateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UserUpdate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    email: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    password: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref15, _ref16) {
    var _this4 = this;

    var userGlobalId = _ref15.id,
        email = _ref15.email,
        password = _ref15.password;
    var db = _ref16.db,
        req = _ref16.req;
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var err, _fromGlobalId5, userLocalId;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              err = void 0;

              if (!(err = inputPresentCheck({ email: email, password: password }))) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt('return', new _graphql.GraphQLError(err));

            case 3:
              if (!(err = isSignedinCheck(req))) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return', new _graphql.GraphQLError(err));

            case 5:
              if (!(err = isTheUserCheck(userGlobalId, req.user._id))) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', new _graphql.GraphQLError(err));

            case 7:
              if (!(err = emailValidCheck(email))) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt('return', new _graphql.GraphQLError(err));

            case 9:
              _context2.t0 = email !== req.user.email;

              if (!_context2.t0) {
                _context2.next = 14;
                break;
              }

              _context2.next = 13;
              return userUniqueCheck(email, db);

            case 13:
              _context2.t0 = err = _context2.sent;

            case 14:
              if (!_context2.t0) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt('return', new _graphql.GraphQLError(err));

            case 16:
              _fromGlobalId5 = (0, _graphqlRelay.fromGlobalId)(userGlobalId), userLocalId = _fromGlobalId5.id;
              return _context2.abrupt('return', new Promise(function (resolve) {
                return db.collection(userCollectionName).findAndModify({ _id: new _mongodb.ObjectID(userLocalId) }, [], {
                  $set: {
                    email: email,
                    password: passwordHash(password)
                  }
                }, {
                  new: true
                }, function (err, _ref17) {
                  var user = _ref17.value;

                  req.logIn(user, function () {
                    (0, _mailer.userCrudMailSend)('userUpdate', email, password);
                    return resolve(user);
                  });
                });
              }));

            case 18:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this4);
    }))();
  }
});

var UserDeleteMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UserDelete',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve: function resolve() {
        return {};
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref18, _ref19) {
    var userGlobalId = _ref18.id;
    var db = _ref19.db,
        req = _ref19.req;


    var err = void 0;
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isTheUserCheck(userGlobalId, req.user._id)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId6 = (0, _graphqlRelay.fromGlobalId)(userGlobalId),
        userLocalId = _fromGlobalId6.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(req.user._profileId) }, [], {}, { remove: true }, function () {
        return resolve(null);
      });
    }).then(function () {
      return new Promise(function (resolve) {
        return db.collection(userCollectionName).findAndModify({ _id: new _mongodb.ObjectID(userLocalId) }, [], {}, { remove: true }, function (err, _ref20) {
          var user = _ref20.value;

          (0, _mailer.userCrudMailSend)('userDelete', user.email, undefined);
          req.logout();
          return resolve(user);
        });
      });
    });
  }
});

var UserSigninMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UserSignin',
  inputFields: {
    email: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    password: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref21, _ref22) {
    var _this5 = this;

    var email = _ref21.email,
        password = _ref21.password;
    var req = _ref22.req;
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var err;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              err = void 0;

              if (!(err = inputPresentCheck({ email: email, password: password }))) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt('return', new _graphql.GraphQLError(err));

            case 3:
              return _context3.abrupt('return', new Promise(function (resolve) {
                return _passport2.default.authenticate('local', function (err, user, info) {
                  if (info) {
                    return resolve(new _graphql.GraphQLError(info));
                  }

                  return req.logIn(user, function () {
                    return resolve(user);
                  });
                })((0, _extends3.default)({}, req, {
                  body: {
                    email: email,
                    password: password
                  }
                }));
              }));

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this5);
    }))();
  }
});

var UserSignoutMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UserSignout',
  inputFields: {},
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_, _ref23) {
    var req = _ref23.req;

    req.logout();
    return {};
  }
});

var UserPasswordResetMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UserPasswordReset',
  inputFields: {
    email: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref24, _ref25) {
    var _this6 = this;

    var email = _ref24.email;
    var db = _ref25.db;
    return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var err, password;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              err = void 0;

              if (!(err = inputPresentCheck({ email: email }))) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt('return', new _graphql.GraphQLError(err));

            case 3:
              _context4.next = 5;
              return userRegisteredCheck(email, db);

            case 5:
              if (!(err = _context4.sent)) {
                _context4.next = 7;
                break;
              }

              return _context4.abrupt('return', new _graphql.GraphQLError(err));

            case 7:
              password = passwordGenerate();
              return _context4.abrupt('return', new Promise(function (resolve) {
                return db.collection(userCollectionName).findAndModify({ email: email }, [], {
                  $set: {
                    password: passwordHash(password)
                  }
                }, {
                  new: true
                }, function (err, _ref26) {
                  var user = _ref26.value;

                  (0, _mailer.userCrudMailSend)('userPasswordReset', user.email, password);
                  return resolve(user);
                });
              }));

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this6);
    }))();
  }
});

var ProfileUpdateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileUpdate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    fullName: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    title: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    currentCompany: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    educationTitle: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    country: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    region: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref27, _ref28) {
    var profileGlobalId = _ref27.id,
        fullName = _ref27.fullName,
        title = _ref27.title,
        currentCompany = _ref27.currentCompany,
        educationTitle = _ref27.educationTitle,
        country = _ref27.country,
        region = _ref27.region;
    var db = _ref28.db,
        req = _ref28.req;


    var err = void 0;
    if (err = inputPresentCheck({
      fullName: fullName,
      title: title,
      currentCompany: currentCompany,
      educationTitle: educationTitle,
      country: country,
      region: region
    })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId7 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId7.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $set: {
          fullName: fullName,
          title: title,
          currentCompany: currentCompany,
          educationTitle: educationTitle,
          country: country,
          region: region
        }
      }, {
        new: true
      }, function (err, _ref29) {
        var profile = _ref29.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileExperienceCreateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileExperienceCreate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    company: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    title: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    description: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    country: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    region: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    since: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    until: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref30, _ref31) {
    var profileGlobalId = _ref30.id,
        company = _ref30.company,
        title = _ref30.title,
        description = _ref30.description,
        country = _ref30.country,
        region = _ref30.region,
        since = _ref30.since,
        until = _ref30.until;
    var db = _ref31.db,
        req = _ref31.req;


    var err = void 0;
    if (err = inputPresentCheck({
      company: company,
      title: title,
      country: country,
      region: region,
      since: since,
      until: until,
      description: description
    })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId8 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId8.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $push: {
          experiences: {
            $each: [{
              _id: new _mongodb.ObjectID(),
              company: company,
              title: title,
              description: description,
              country: country,
              region: region,
              since: since,
              until: until
            }],
            $position: 0
          }
        }
      }, {
        new: true
      }, function (err, _ref32) {
        var profile = _ref32.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileExperienceUpdateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileExperienceUpdate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    experienceId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    company: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    title: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    description: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    country: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    region: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    since: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    until: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref33, _ref34) {
    var profileGlobalId = _ref33.id,
        experienceGlobalId = _ref33.experienceId,
        company = _ref33.company,
        title = _ref33.title,
        description = _ref33.description,
        country = _ref33.country,
        region = _ref33.region,
        since = _ref33.since,
        until = _ref33.until;
    var db = _ref34.db,
        req = _ref34.req;


    var err = void 0;
    if (err = inputPresentCheck({
      company: company,
      title: title,
      country: country,
      region: region,
      since: since,
      until: until,
      description: description
    })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId9 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId9.id;

    var _fromGlobalId10 = (0, _graphqlRelay.fromGlobalId)(experienceGlobalId),
        experienceLocalId = _fromGlobalId10.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({
        _id: new _mongodb.ObjectID(profileLocalId),
        'experiences._id': new _mongodb.ObjectID(experienceLocalId)
      }, [], {
        $set: {
          'experiences.$.company': company,
          'experiences.$.title': title,
          'experiences.$.country': country,
          'experiences.$.region': region,
          'experiences.$.since': since,
          'experiences.$.until': until,
          'experiences.$.description': description
        }
      }, {
        new: true
      }, function (err, _ref35) {
        var profile = _ref35.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileExperienceDeleteMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileExperienceDelete',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    experienceId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref36, _ref37) {
    var profileGlobalId = _ref36.id,
        experienceGlobalId = _ref36.experienceId;
    var db = _ref37.db,
        req = _ref37.req;


    var err = void 0;
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId11 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId11.id;

    var _fromGlobalId12 = (0, _graphqlRelay.fromGlobalId)(experienceGlobalId),
        experienceLocalId = _fromGlobalId12.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $pull: {
          experiences: {
            _id: new _mongodb.ObjectID(experienceLocalId)
          }
        }
      }, {
        new: true
      }, function (err, _ref38) {
        var profile = _ref38.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileEducationCreateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileEducationCreate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    date: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    degree: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    title: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref39, _ref40) {
    var profileGlobalId = _ref39.id,
        date = _ref39.date,
        degree = _ref39.degree,
        title = _ref39.title;
    var db = _ref40.db,
        req = _ref40.req;


    var err = void 0;
    if (err = inputPresentCheck({
      date: date,
      degree: degree,
      title: title
    })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId13 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId13.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $push: {
          educations: {
            $each: [{
              _id: new _mongodb.ObjectID(),
              date: date,
              degree: degree,
              title: title
            }],
            $position: 0
          }
        }
      }, {
        new: true
      }, function (err, _ref41) {
        var profile = _ref41.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileEducationUpdateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileEducationUpdate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    educationId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    date: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    degree: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
    title: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref42, _ref43) {
    var profileGlobalId = _ref42.id,
        educationGlobalId = _ref42.educationId,
        date = _ref42.date,
        degree = _ref42.degree,
        title = _ref42.title;
    var db = _ref43.db,
        req = _ref43.req;


    var err = void 0;
    if (err = inputPresentCheck({
      date: date,
      degree: degree,
      title: title
    })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId14 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId14.id;

    var _fromGlobalId15 = (0, _graphqlRelay.fromGlobalId)(educationGlobalId),
        educationLocalId = _fromGlobalId15.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({
        _id: new _mongodb.ObjectID(profileLocalId),
        'educations._id': new _mongodb.ObjectID(educationLocalId)
      }, [], {
        $set: {
          'educations.$.date': date,
          'educations.$.degree': degree,
          'educations.$.title': title
        }
      }, {
        new: true
      }, function (err, _ref44) {
        var profile = _ref44.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileEducationDeleteMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileEducationDelete',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    educationId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref45, _ref46) {
    var profileGlobalId = _ref45.id,
        educationGlobalId = _ref45.educationId;
    var db = _ref46.db,
        req = _ref46.req;


    var err = void 0;
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId16 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId16.id;

    var _fromGlobalId17 = (0, _graphqlRelay.fromGlobalId)(educationGlobalId),
        educationLocalId = _fromGlobalId17.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $pull: {
          educations: {
            _id: new _mongodb.ObjectID(educationLocalId)
          }
        }
      }, {
        new: true
      }, function (err, _ref47) {
        var profile = _ref47.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileSkillCreateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileSkillCreate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    name: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref48, _ref49) {
    var profileGlobalId = _ref48.id,
        name = _ref48.name;
    var db = _ref49.db,
        req = _ref49.req;


    var err = void 0;
    if (err = inputPresentCheck({ name: name })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId18 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId18.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $push: {
          skills: {
            $each: [{
              _id: new _mongodb.ObjectID(),
              name: name
            }],
            $position: 0
          }
        }
      }, {
        new: true
      }, function (err, _ref50) {
        var profile = _ref50.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileSkillUpdateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileSkillUpdate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    skillId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    name: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref51, _ref52) {
    var profileGlobalId = _ref51.id,
        skillGlobalId = _ref51.skillId,
        name = _ref51.name;
    var db = _ref52.db,
        req = _ref52.req;


    var err = void 0;
    if (err = inputPresentCheck({ name: name })) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId19 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId19.id;

    var _fromGlobalId20 = (0, _graphqlRelay.fromGlobalId)(skillGlobalId),
        skillLocalId = _fromGlobalId20.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({
        _id: new _mongodb.ObjectID(profileLocalId),
        'skills._id': new _mongodb.ObjectID(skillLocalId)
      }, [], {
        $set: {
          'skills.$.name': name
        }
      }, {
        new: true
      }, function (err, _ref53) {
        var profile = _ref53.value;

        return resolve(profile);
      });
    });
  }
});

var ProfileSkillDeleteMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfileSkillDelete',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    skillId: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref54, _ref55) {
    var profileGlobalId = _ref54.id,
        skillGlobalId = _ref54.skillId;
    var db = _ref55.db,
        req = _ref55.req;


    var err = void 0;
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId21 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId21.id;

    var _fromGlobalId22 = (0, _graphqlRelay.fromGlobalId)(skillGlobalId),
        skillLocalId = _fromGlobalId22.id;

    return new Promise(function (resolve) {
      return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
        $pull: {
          skills: {
            _id: new _mongodb.ObjectID(skillLocalId)
          }
        }
      }, {
        new: true
      }, function (err, _ref56) {
        var profile = _ref56.value;

        return resolve(profile);
      });
    });
  }
});

var ProfilePictureUpdateMutation = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ProfilePictureUpdate',
  inputFields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    file: { type: _graphql.GraphQLString }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: function resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve: function resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(_ref57, _ref58) {
    var profileGlobalId = _ref57.id;
    var db = _ref58.db,
        req = _ref58.req;


    var err = void 0;
    if (err = isSignedinCheck(req)) {
      return new _graphql.GraphQLError(err);
    }
    if (err = isCreatorCheck(profileGlobalId, req.user._profileId)) {
      return new _graphql.GraphQLError(err);
    }

    var _fromGlobalId23 = (0, _graphqlRelay.fromGlobalId)(profileGlobalId),
        profileLocalId = _fromGlobalId23.id;

    return new Promise(function (resolve) {
      return _fs2.default.writeFile(_path2.default.join(process.cwd(), 'media', profileLocalId), req.file.buffer, function () {
        return resolve(null);
      });
    }).then(function () {
      return new Promise(function (resolve) {
        return db.collection(profileCollectionName).findAndModify({ _id: new _mongodb.ObjectID(profileLocalId) }, [], {
          $set: {
            profilePicture: '/' + profileLocalId
          }
        }, {
          new: true
        }, function (err, _ref59) {
          var profile = _ref59.value;

          return resolve(profile);
        });
      });
    });
  }
});

var mutationType = new _graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: function fields() {
    return {
      userCreate: UserCreateMutation,
      userUpdate: UserUpdateMutation,
      userDelete: UserDeleteMutation,
      userSignin: UserSigninMutation,
      userSignout: UserSignoutMutation,
      userPasswordReset: UserPasswordResetMutation,
      profileUpdate: ProfileUpdateMutation,
      profileExperienceCreate: ProfileExperienceCreateMutation,
      profileExperienceUpdate: ProfileExperienceUpdateMutation,
      profileExperienceDelete: ProfileExperienceDeleteMutation,
      profileEducationCreate: ProfileEducationCreateMutation,
      profileEducationUpdate: ProfileEducationUpdateMutation,
      profileEducationDelete: ProfileEducationDeleteMutation,
      profileSkillCreate: ProfileSkillCreateMutation,
      profileSkillUpdate: ProfileSkillUpdateMutation,
      profileSkillDelete: ProfileSkillDeleteMutation,
      profilePictureUpdate: ProfilePictureUpdateMutation
    };
  }
});

var schemaType = new _graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

var schemaGet = function schemaGet(db) {
  _db = db;

  return schemaType;
};

exports.schemaGet = schemaGet;
//# sourceMappingURL=index.js.map