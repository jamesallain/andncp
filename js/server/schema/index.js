'use strict';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError
} from 'graphql';
import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId
} from 'graphql-relay';
import {ObjectID} from 'mongodb';
import passport from 'passport';
import emailValidator from 'email-validator';
import bcryptjs from 'bcryptjs';
import passwordGenerator from 'password-generator';
import fs from 'fs';
import path from 'path';

import {userCrudMailSend} from '../mailer';

let _db;
const userCollectionName = 'user';
const profileCollectionName = 'profile';
const postCollectionName = 'post';
const commentCollectionName = 'comment';

//functions---------------------------------------------------------------------------------------------
const entityGet = (query, collectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(collectionName)
      .findOne(
        query,
        (err, entity) => {
          return resolve(entity);
        }
      );
  });
};

const promisedArrayGet = (query, sort, limit, collectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(collectionName)
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray((err, entities) => {
        return resolve(entities);
      });
  });
};

const inputPresentCheck = (input) => {
  return Object.keys(input)
    .reduce((memo, key) => {
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

const emailValidCheck = (email) => {
  return (emailValidator.validate(email)) ?
    null :
    ({
      message: 'invalid',
      source: 'email'
    });
};

const entityCountGet = (query, collectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(collectionName)
      .find(query)
      .count((err, count) => {
        return resolve(count);
      });
  });
};

const userUniqueCheck = (email, db) => {
  return entityCountGet(
    {email},
    userCollectionName,
    db
  )
    .then((count) => {
      if (count) {
        return {
          message: 'registered',
          source: 'email'
        };
      }

      return null;
    });
};

const userRegisteredCheck = (email, db) => {
  return entityCountGet(
    {email},
    userCollectionName,
    db
  )
    .then((count) => {
      if (!count) {
        return {
          message: 'not registered',
          source: 'email'
        };
      }

      return null;
    });
};

const passwordHash = (password) => {
  const salt = bcryptjs.genSaltSync(4);
  return bcryptjs.hashSync(password, salt);
};

const passwordGenerate = () => {
  return passwordGenerator();
};

const isSignedinCheck = (req) => {
  return (!req.user) ?
    ({
      message: 'not signedin',
      source: 'auth'
    }) :
    null;
};

const isTheUserCheck = (userGlobalId, _userId) => {
  const {id: userLocalId} = fromGlobalId(userGlobalId);

  return (userLocalId.toString() !== _userId.toString()) ?
    ({
      message: 'not authorised',
      source: 'auth'
    }) :
    null;
};

const isCreatorCheck = (profileGlobalId, _profileId) => {
  const {id: profileLocalId} = fromGlobalId(profileGlobalId);

  return (profileLocalId.toString() !== _profileId.toString()) ?
    ({
      message: 'not authorised',
      source: 'auth'
    }) :
    null;
};


//objects---------------------------------------------------------------------------------------------
class Viewer extends Object {}
const viewerGet = () => {
  return Object.assign(
    new Viewer(),
    {
      _id: 'Viewer'
    }
  );
};
class Profile extends Object {}
const profileGet = (profileLocalId) => {
  return entityGet(profileLocalId, profileCollectionName, _db)
    .then((profile) => {
      return Object.assign(
        new Profile(),
        profile
      );
    });
};
class Post extends Object {}
const postGet = (postLocalId) => {
  return entityGet(postLocalId, postCollectionName, _db)
    .then((post) => {
      return Object.assign(
        new Post(),
        post
      );
    });
};
class Comment extends Object {}
const commentGet = (commentLocalId) => {
  return entityGet(commentLocalId, commentCollectionName, _db)
    .then((comment) => {
      return Object.assign(
        new Comment(),
        comment
      );
    });
};

//nodeDefinitions------------------------------------------------------------------------
const {
  nodeInterface,
  nodeField
} = nodeDefinitions(
  (globalId) => {
    const {id: localId, type} = fromGlobalId(globalId);

    switch (type) {
      case 'Viewer':
        return viewerGet(localId);
      case 'Profile':
        return profileGet(localId);
      case 'Post':
        return postGet(localId)
      case 'Comment':
        return commentGet(localId)        
      default:
        return null;
    }
  },
  (obj) => {
    switch (true) {
      case (obj instanceof Viewer):
        return viewerType;
      case (obj instanceof Profile):
        return profileType;
      case (obj instanceof Post):
        return postType;
      case (obj instanceof Comment):
        return commentType;
      default:
        return null;
    }
  }
);

//types---------------------------------------------------------------------------------------
const languageType = new GraphQLObjectType({
  name: 'Language',
  fields() {
    return {
      language: {type: GraphQLString},
      level: {type: GraphQLString}
    };
  }
});

const skillType = new GraphQLObjectType({
  name: 'Skill',
  fields() {
    return {
      id: globalIdField('Skill', ({_id: skillLocalId}) => {
        return skillLocalId;
      }),
      _id: {type: GraphQLID},
      name: {type: GraphQLString},
      recommendations: {type: GraphQLString}
    };
  }
});

const experienceType = new GraphQLObjectType({
  name: 'Experience',
  fields() {
    return {
      id: globalIdField('Experience', ({_id: experienceLocalId}) => {
        return experienceLocalId;
      }),
      _id: {type: GraphQLID},
      company: {type: GraphQLString},
      description: {type: GraphQLString},
      country: {type: GraphQLString},
      region: {type: GraphQLString},
      location: {type: GraphQLString},
      since: {type: GraphQLString},
      title: {type: GraphQLString},
      until: {type: GraphQLString}
    };
  }
});

const educationType = new GraphQLObjectType({
  name: 'Education',
  fields() {
    return {
      id: globalIdField('Education', ({_id: educationLocalId}) => {
        return educationLocalId;
      }),
      _id: {type: GraphQLID},
      major: {type: GraphQLString},
      date: {type: GraphQLString},
      degree: {type: GraphQLString},
      title: {type: GraphQLString}
    };
  }
});

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields() {
    return {
      id: globalIdField('Profile', ({_id: profileLocalId}) => {
        return profileLocalId;
      }),
      _id: {type: GraphQLID},
      fullName: {type: GraphQLString},
      industry: {type: GraphQLString},
      languages: {type: new GraphQLList(languageType)},
      previousCompanies: {type: new GraphQLList(GraphQLString)},
      profilePicture: {type: GraphQLString},
      skills: {type: new GraphQLList(skillType)},
      title: {type: GraphQLString},
      experiences: {type: new GraphQLList(experienceType)},
      educations: {type: new GraphQLList(educationType)},
      currentCompany: {type: GraphQLString},
      educationTitle: {type: GraphQLString},
      country: {type: GraphQLString},
      region: {type: GraphQLString}
    };
  },
  interfaces: [nodeInterface]
});

const {
  connectionType: profileConnectionType
} = connectionDefinitions({
  name: 'Profile',
  nodeType: profileType
});

const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields() {
    return {
      id: globalIdField('Comment', ({_id: commentLocalId}) => {
        return commentLocalId;
      }),
      _id: {type: GraphQLID},
      _postId: {type: GraphQLID},
      text: {type: GraphQLString}
    };
  }
});

const {
  connectionType: commentConnectionType,
  edgeType: commentEdgeType
} = connectionDefinitions({
  name: 'Comment',
  nodeType: commentType
});

const postType = new GraphQLObjectType({
  name: 'Post',
  fields() {
    return {
      id: globalIdField('Post', ({_id: postLocalId}) => {
        return postLocalId;
      }),
      _id: {type: GraphQLID},
      text: {type: GraphQLString},
      comment: {
        type: commentConnectionType,
        args: {
          ...connectionArgs
        },
        resolve({_id: postLocalId}, {...connectionArgs}, {db}) {
          return connectionFromPromisedArray(
            promisedArrayGet(
              (() => {
                let q = {_postId: new ObjectID(postLocalId)};

                return q;
              })(),
              {_id: 1},
              commentCollectionName,
              db
            ),
            connectionArgs
          );
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

const {
  connectionType: postConnectionType,
  edgeType: postEdgeType
} = connectionDefinitions({
  name: 'Post',
  nodeType: postType
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields() {
    return {
      id: globalIdField('User', ({_id: userLocalId}) => {
        return userLocalId;
      }),
      _id: {type: GraphQLID},
      email: {type: GraphQLString},
      password: {type: GraphQLString},
      profileId: globalIdField('Profile', ({_profileId: profileLocalId}) => {
        return profileLocalId;
      }),
      _profileId: {type: GraphQLID},
      
      post: {
        type: postConnectionType,
        args: {
          ...connectionArgs
        },
        resolve({_id: userLocalId}, {...connectionArgs}, {db}) {
          return connectionFromPromisedArray(
            promisedArrayGet(
              (() => {
                let q = {_userId: new ObjectID(userLocalId)};

                return q;
              })(),
              {_id: 1},
              postCollectionName,
              db
            ),
            connectionArgs
          );
        }
      }
      
    };
  }
});

const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields() {
    return {
      id: globalIdField('Viewer', ({_id: viewerLocalId}) => {
        return viewerLocalId;
      }),
      _id: {type: GraphQLID},
      user: {
        type: userType,
        resolve(parent, args, {req: {user}}) {
          return user || {};
        }
      },
      profile: {
        type: profileConnectionType,
        args: {
          id: {type: GraphQLID},
          searchTerm: {type: GraphQLString},
          ...connectionArgs
        },
        resolve(parent, {id: profileGlobalId, searchTerm, ...connectionArgs}, {db}) {
          const query = (() => {
            const q = {};

            if (profileGlobalId) {
              const {id: profileLocalId} = fromGlobalId(profileGlobalId);

              Object.assign(
                q,
                {_id: new ObjectID(profileLocalId)}
              );
            }

            if (searchTerm) {
              Object.assign(
                q,
                {
                  $text: {
                    $search: `\"${searchTerm}\"`
                  }
                }
              );
            }

            return q;
          })();
          const sort = {_id: -1};
          const limit = 0;

          return connectionFromPromisedArray(
            promisedArrayGet(
              query,
              sort,
              limit,
              profileCollectionName,
              db
            ),
            connectionArgs
          );
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

//query root-------------------------------------------------------------------------------------------
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields() {
    return {
      node: nodeField,
      viewer: {
        type: viewerType,
        resolve() {
          return viewerGet();
        }
      }
    };
  }
});

//mutations----------------------------------------------------------------------------------------
const UserCreateMutation = mutationWithClientMutationId({
  name: 'UserCreate',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({email, password}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({email, password}))) {
      return new GraphQLError(err);
    }
    if ((err = emailValidCheck(email))) {
      return new GraphQLError(err);
    }
    if ((err = await userUniqueCheck(email, db))) {
      return new GraphQLError(err);
    }

    const _profileId = new ObjectID();

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: _profileId},
          [],
          ({
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
          }),
          ({
            upsert: true,
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    })

    .then(() => {
      return new Promise((resolve) => {
        return db.collection(userCollectionName)
          .findAndModify(
            {_id: new ObjectID()},
            [],
            ({
              $set: {
                email,
                password: passwordHash(password),
                _profileId
              }
            }),
            ({
              upsert: true,
              new: true
            }),
            (err,  {value: user}) => {
              req.logIn(user, () => {
                userCrudMailSend(
                  'userCreate',
                  email,
                  password
                );
                return resolve(user);
              });
            }
          );
      });
    });
  }
});

const UserUpdateMutation = mutationWithClientMutationId({
  name: 'UserUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({id: userGlobalId, email, password}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({email, password}))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isTheUserCheck(userGlobalId, req.user._id))) {
      return new GraphQLError(err);
    }
    if ((err = emailValidCheck(email))) {
      return new GraphQLError(err);
    }
    if (email !== req.user.email &&
        (err = await userUniqueCheck(email, db))) {
      return new GraphQLError(err);
    }

    const {id: userLocalId} = fromGlobalId(userGlobalId);

    return new Promise((resolve) => {
      return db.collection(userCollectionName)
        .findAndModify(
          {_id: new ObjectID(userLocalId)},
          [],
          ({
            $set: {
              email,
              password: passwordHash(password)
            }
          }),
          ({
            new: true
          }),
          (err, {value: user}) => {
            req.logIn(user, () => {
              userCrudMailSend(
                'userUpdate',
                email,
                password
              );
              return resolve(user);
            });
          }
        );
    });
  }
});

const UserDeleteMutation = mutationWithClientMutationId({
  name: 'UserDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve() {
        return {};
      }
    }
  },
  mutateAndGetPayload({id: userGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isTheUserCheck(userGlobalId, req.user._id))) {
      return new GraphQLError(err);
    }

    const {id: userLocalId} = fromGlobalId(userGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(req.user._profileId)},
          [],
          {},
          {remove: true},
          () => {
            return resolve(null);
          }
        );
    })
    .then(() => {
      return new Promise((resolve) => {
        return db.collection(userCollectionName)
          .findAndModify(
            {_id: new ObjectID(userLocalId)},
            [],
            {},
            {remove: true},
            (err, {value: user}) => {
              userCrudMailSend(
                'userDelete',
                user.email,
                undefined
              );
              req.logout();
              return resolve(user);
            }
          );
      });
    });
  }
});

const UserSigninMutation = mutationWithClientMutationId({
  name: 'UserSignin',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({email, password}, {req}) {

    let err;
    if ((err = inputPresentCheck({email, password}))) {
      return new GraphQLError(err);
    }

    return new Promise((resolve) => {
      return passport.authenticate('local', (err, user, info) => {
        if (info) {
          return resolve(new GraphQLError(info));
        }

        return req.logIn(user, () => {
          return resolve(user);
        });
      })({
        ...req,
        body: {
          email,
          password
        }
      });
    });
  }
});

const UserSignoutMutation = mutationWithClientMutationId({
  name: 'UserSignout',
  inputFields: {},
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    }
  },
  mutateAndGetPayload(_, {req}) {
    req.logout();
    return {};
  }
});

const UserPasswordResetMutation = mutationWithClientMutationId({
  name: 'UserPasswordReset',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({email}, {db}) {

    let err;
    if ((err = inputPresentCheck({email}))) {
      return new GraphQLError(err);
    }

    if ((err = await userRegisteredCheck(email, db))) {
      return new GraphQLError(err);
    }

    const password = passwordGenerate();

    return new Promise((resolve) => {
      return db.collection(userCollectionName)
        .findAndModify(
          {email},
          [],
          ({
            $set: {
              password: passwordHash(password)
            }
          }),
          ({
            new: true
          }),
          (err, {value: user}) => {
            userCrudMailSend(
              'userPasswordReset',
              user.email,
              password
            );
            return resolve(user);
          }
        );
    });
  }
});

const ProfileUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    fullName: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    currentCompany: {type: new GraphQLNonNull(GraphQLString)},
    educationTitle: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: profileGlobalId,
      fullName,
      title,
      currentCompany,
      educationTitle,
      country,
      region
    },
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      fullName,
      title,
      currentCompany,
      educationTitle,
      country,
      region
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $set: {
              fullName,
              title,
              currentCompany,
              educationTitle,
              country,
              region
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileExperienceCreateMutation = mutationWithClientMutationId({
  name: 'ProfileExperienceCreate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    company: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    since: {type: new GraphQLNonNull(GraphQLString)},
    until: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, company, title, description, country, region, since, until},
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      company,
      title,
      country,
      region,
      since,
      until,
      description
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $push: {
              experiences: {
                $each: [{
                  _id: new ObjectID(),
                  company,
                  title,
                  description,
                  country,
                  region,
                  since,
                  until
                }],
                $position: 0
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileExperienceUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileExperienceUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    experienceId: {type: new GraphQLNonNull(GraphQLID)},
    company: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    since: {type: new GraphQLNonNull(GraphQLString)},
    until: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: profileGlobalId,
      experienceId: experienceGlobalId,
      company,
      title,
      description,
      country,
      region,
      since,
      until
    },
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      company,
      title,
      country,
      region,
      since,
      until,
      description
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: experienceLocalId} = fromGlobalId(experienceGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(profileLocalId),
            'experiences._id': new ObjectID(experienceLocalId)
          }),
          [],
          ({
            $set: {
              'experiences.$.company': company,
              'experiences.$.title': title,
              'experiences.$.country': country,
              'experiences.$.region': region,
              'experiences.$.since': since,
              'experiences.$.until': until,
              'experiences.$.description': description
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileExperienceDeleteMutation = mutationWithClientMutationId({
  name: 'ProfileExperienceDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    experienceId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, experienceId: experienceGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: experienceLocalId} = fromGlobalId(experienceGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $pull: {
              experiences: {
                _id: new ObjectID(experienceLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileEducationCreateMutation = mutationWithClientMutationId({
  name: 'ProfileEducationCreate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLString)},
    date: {type: new GraphQLNonNull(GraphQLString)},
    degree: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, date, degree, title}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({
      date,
      degree,
      title
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $push: {
              educations: {
                $each: [{
                  _id: new ObjectID(),
                  date,
                  degree,
                  title
                }],
                $position: 0
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileEducationUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileEducationUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    educationId: {type: new GraphQLNonNull(GraphQLID)},
    date: {type: new GraphQLNonNull(GraphQLString)},
    degree: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, educationId: educationGlobalId, date, degree, title},
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      date,
      degree,
      title
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: educationLocalId} = fromGlobalId(educationGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(profileLocalId),
            'educations._id': new ObjectID(educationLocalId)
          }),
          [],
          ({
            $set: {
              'educations.$.date': date,
              'educations.$.degree': degree,
              'educations.$.title': title
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileEducationDeleteMutation = mutationWithClientMutationId({
  name: 'ProfileEducationDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    educationId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, educationId: educationGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: educationLocalId} = fromGlobalId(educationGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $pull: {
              educations: {
                _id: new ObjectID(educationLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileSkillCreateMutation = mutationWithClientMutationId({
  name: 'ProfileSkillCreate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, name}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({name}))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $push: {
              skills: {
                $each: [{
                  _id: new ObjectID(),
                  name
                }],
                $position: 0
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileSkillUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileSkillUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    skillId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, skillId: skillGlobalId, name}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({name}))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: skillLocalId} = fromGlobalId(skillGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(profileLocalId),
            'skills._id': new ObjectID(skillLocalId)
          }),
          [],
          ({
            $set: {
              'skills.$.name': name
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfileSkillDeleteMutation = mutationWithClientMutationId({
  name: 'ProfileSkillDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    skillId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, skillId: skillGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: skillLocalId} = fromGlobalId(skillGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $pull: {
              skills: {
                _id: new ObjectID(skillLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

const ProfilePictureUpdateMutation = mutationWithClientMutationId({
  name: 'ProfilePictureUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    file: {type: GraphQLString}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return fs.writeFile(
        path.join(process.cwd(), 'media', profileLocalId),
        req.file.buffer,
        () => {
          return resolve(null);
        }
      );
    })

    .then(() => {
      return new Promise((resolve) => {
        return db.collection(profileCollectionName)
          .findAndModify(
            {_id: new ObjectID(profileLocalId)},
            [],
            ({
              $set: {
                profilePicture: `/${profileLocalId}`
              }
            }),
            ({
              new: true
            }),
            (err, {value: profile}) => {
              return resolve(profile);
            }
          );
      });
    });
  }
});


//mutation root---------------------------------------------------------------------------------------
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields() {
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

const schemaType = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

const schemaGet = (db) => {
  _db = db;

  return schemaType;
};

export {
  schemaGet
};
