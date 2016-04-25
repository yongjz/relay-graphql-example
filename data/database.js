export class Game {}
export class HidingSpot {}

var game = new Game();
game.id = '1';

const logID = 'qldfjbe2434RZRFeerg';

var hidingSpots = [];
(function() {
  var hidingSpot;
  var indexOfSpotWithTreasure = Math.floor(Math.random() * 9);
  console.log(indexOfSpotWithTreasure);
  for (var i = 0; i < 9; i++) {
    hidingSpot = new HidingSpot();
    hidingSpot.id = `${i}`;
    hidingSpot.hasTreasure = (i === indexOfSpotWithTreasure);
    hidingSpot.testField = i;
    hidingSpot.hasBeenChecked = false;
    hidingSpots.push(hidingSpot);
  }
})();

var turnsRemaining = 3;

export function checkHidingSpotForTreasure(id) {
  if (hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked)) {
    return;
  }
  turnsRemaining--;
  var hidingSpot = getHidingSpot(id);
  hidingSpot.hasBeenChecked = true;
}

export function getHidingSpot(id) {
  return hidingSpots.find(hs => hs.id === id);
}

export function getGame() {
  return game;
}

export function getHidingSpots() {
  return hidingSpots;
}

export function getTurnsRemaining() {
  return turnsRemaining;
}

export class User {}

export function login(username, password) {
  user.isLogin = false;
  user.username = 'guest';
  if (username === 'admin' && password === '123456') {
    user.isLogin = true;
    user.username = 'admin'
  }
  return user;
}

export function getUser() {
  console.log("exec getUser");
  return {
    username: '',
    mail: '',
    userID: '',
    id: logID
  };
}

export function getUserByCredentials(credentials, rootValue) {
  if (credentials.username === '') {
    // rootValue.cookies.set('userID', '');
    return {
      username: '',
      mail: '',
      userID: '',
      id: logID
    };
  }

  if (credentials.username === 'admin' && credentials.password === '123456') {
    var user = {
      name: 'admin',
      mail: 'admin@admin.com',
      userID: '1',
      id: logID,
    };
  }
  // rootValue.cookies.set('userID', user.userID);
  console.log('database:getUserByCredentials:', user);
  return user;
}
