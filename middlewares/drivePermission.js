const {
  accessByUser,
  accessGroup, groupMember, accessByGroup,
  accessByToken
} = require('../db/drivePermission');
const path = require('path');
const db = require('../db/db');
const { Op, QueryTypes } = require('sequelize');

let getPermFunc = async (user, token) => {

  // general validation check
  if (!user && !token) return [];

  if (token) {
    // token validation check
    let firstCher = token[0];
    if (firstCher !== 'T' && // access by token
        firstCher !== 'G' && // access by group (group token)
        firstCher !== 'U') { // access by user (user token)
      return [];
    }
  }

  if (token && token[0] === 'T') {
    let dbRes = await accessByToken.findOne({
      attributes: [
        'id', 'permissionPath', 'validCode'
      ],
      where: {
        token,
        validCode: {
          [Op.gte]: 1
        }
      }
    });
    return dbRes ? [{
      token,
      path: dbRes.permissionPath,
      level: dbRes.validCode
    }] : [];
  }
  
  if (!user) return [];

  if (token && token[0] === 'G') {
    let qstr =
`
SELECT
      groupMembers.groupId,
      accessByGroups.permissionPath,
      accessByGroups.validCode
FROM accessByGroups INNER JOIN groupMembers
ON accessByGroups.groupId = groupMembers.groupId
WHERE groupMembers.userid = :userid AND
      accessByGroups.permissionCode = :token AND
      accessByGroups.validCode >= 1 AND
      groupMembers.validCode = 0;
`;
    return await db.query(qstr, {
      replacements: {
        userid: user.userid,
        token
      },
      type: QueryTypes.SELECT
    }).map(per => {
      return {
        token,
        path: per.permissionPath,
        level: per.validCode
      }
    });
  }
  let where = {
    userid: user.userid
  };

  if (token) where.permissionCode = token;

  let defaultPerm = {
    token: '',
    path: path.join('/', user.username),
    level: 2
  };

  let ABUserRes = await accessByUser.findAll({
    attributes: [
      'id', 'permissionPath', 'permissionCode', 'validCode'
    ],
    where: where
  }).map(per => {
    return {
      token: per.permissionCode,
      path: per.permissionPath,
      level: per.validCode
    }
  });

  let ABGroupRes = [];

  if (!token) {
    let qstr =
`
SELECT
    groupMembers.groupId,
    accessByGroups.permissionPath,
    accessByGroups.permissionCode,
    accessByGroups.validCode
FROM accessByGroups INNER JOIN groupMembers
ON accessByGroups.groupId = groupMembers.groupId
WHERE groupMembers.userid = :userid AND
    accessByGroups.validCode >= 1 AND
    groupMembers.validCode = 0;
`;
    ABGroupRes = await db.query(qstr, {
      replacements: {
        userid: user.userid
      },
      type: QueryTypes.SELECT
    }).map(per => {
      return {
        token: per.permissionCode,
        path: per.permissionPath,
        level: per.validCode
      }
    });
  }
  
  return [defaultPerm, ...ABUserRes, ...ABGroupRes];
}

const permCheckFromStr = (permissionMode = 'r') => async (req, pathname) => {
  let permissionLevel = 10;
  switch (permissionMode) {
    case 'r':
      permissionLevel = 1;
      break;
    case 'w':
      permissionLevel = 2;
      break;
  }

  let dirpath = path.join('/', pathname);

  // db 연산을 줄이기 위해 owner를 먼저 체크 후 통과시킨다.
  if (req.user && !path.relative(path.join('/', req.user.username), dirpath).startsWith('..')) {
    return {
      rootPath: '/' + req.user.username, // "drive/\test" vs "drive/test"
      level: 2
    };
  }

  // let perm = await getPermFunc(req.user, req.query.token);
  // 위의 줄로 바꾸면 token을 들고있지 않아도 permission체크가 가능하지만
  // path check가 힘들 것 같아 token은 항상 있어야 하는거로...
  const token = req.query.token || req.body.token;
  let perm = token && await getPermFunc(req.user, token);

  for (let i of perm || []) {
    if (!path.relative(i.path, dirpath).startsWith('..') && i.level >= permissionLevel) {
      return {
        rootPath: i.path,
        level: i.level
      };
    }
  }

  return null;
}

const permissionChecker = (permissionMode = 'r') => async (req, res, next) => {
  const fetchFunc = permCheckFromStr(permissionMode);
  const result = await fetchFunc(req, path.join('/', decodeURIComponent(req.path)));
  if (!result) {
    return res.status(403).end('permissionDenied');
  }
  req.permLev = result;
  return next();
}

let getPermission = async (req, res, next) => {
  req.permissions = await getPermFunc(req.user, req.query.token || req.body.token);
  next();
}

module.exports = {
  permissionChecker,
  getPermission,
  permCheckFromStr
}
