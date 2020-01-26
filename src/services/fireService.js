import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
class FireService {
  getCurrentUser() {
    let user = auth().currentUser;
    return user;
  }
  async logOut(navigation) {
    await auth().signOut();
    navigation.navigate('authGuard');
  }
  async UserInit() {
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/users/${uid}`);
    ref.set({
      email: auth().currentUser.email,
    });
  }
  async getUserData() {
    return new Promise(async (resolve, reject) => {
      // Get the users ID
      const uid = auth().currentUser.uid;
      // Create a reference
      const ref = database().ref(`/users/${uid}`);
      // Fetch the data snapshot
      const snapshot = await ref.once('value');
      if (snapshot.val() !== null) {
        resolve(snapshot.val());
      } else {
        let message = {error: 'no data'};
        resolve(message);
      }
    });
  }
  async addNewMapName(value) {
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/users/${uid}/maps`);
    ref.push(value);
  }
  async getNewMapName() {
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/users/${uid}/maps/`);
    const snapshot = await ref.once('value');
    return new Promise((resolve, reject) => {
      let maps = [];
      snapshot.forEach(map => {
         maps.push({mapName : map.val().mapName, statut : map.val().statut, key : map.key})
      })
      let message = {error : 'No data'};
      if(maps.length < 0) {
        resolve(message)
      } else {
        resolve(maps);
      }
    })
  }
    async updateStatut(key,maps) {
    const uid = auth().currentUser.uid;
    for(let i = 0; i < maps.length; i++) {
      if(maps[i].key === key) {
        const ref = database().ref(`/users/${uid}/maps/${key}/`);
        ref.update({statut : true});
      } else {
        const ref = database().ref(`/users/${uid}/maps/${maps[i].key}/`);
        ref.update({statut : false});
      }
    }
    }
  async getDashoardMap() {
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/users/${uid}/maps/`);
    const snapshot = await ref.once('value');
    return new Promise((resolve,reject) => {
      snapshot.forEach(map => {
        if(map.val().statut === true) {
           resolve({key : map.key, mapName : map.val().mapName, statut : map.val().statut});
        }
      })
    })
     
  }
}
export const fireService = new FireService();
