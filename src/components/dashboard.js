import React from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {fireService} from '../services/fireService';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaGF5dGhlbTg4IiwiYSI6ImNrNWpsZmM4cDA0NmMzanBrb2dvdmVvaTUifQ.1VZh2by00aujp9Jz_Rumfw',
);
class dashboardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      User: null,
      map: null,
      modalAnnotation: false,
      name: '',
      longitude: Number,
      latitude: Number,
      description: '',
      Annotation: null,
      render: false,
      userVisible : false
    };
  }
  async componentDidMount() {
    this.fireInit();
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/users/${uid}/maps/`);
    ref.on('value', async () => {
      this.setState({render: false});
      await fireService.getDashoardMap().then(map => {
        this.setState({map: map, render: true});
        this.getAnnotation();
      });
    });
  }
  setModalVisible(visible) {
    this.setState({modalAnnotation: visible});
  }
  async fireInit() {
    await fireService.getUserData().then(async user => {
      if (!user['error']) {
        this.setState({User: user.email});
        await this.getMap();
        this.getAnnotation();
      } else {
        fireService.UserInit();
        this.fireInit();
      }
    });
  }
  async getMap() {
    this.setState({render: false});
    await fireService.getDashoardMap().then(map => {
      if (map) {
        this.setState({map: map, render: true});
      }
    });
  }
  async addAnnotation() {
    if (this.state.name !== '') {
      if (this.state.description !== '') {
        let value = {
          AnnotationName: this.state.name,
          longitude: parseFloat(this.state.longitude),
          latitude: parseFloat(this.state.latitude),
          statut : false,
          description: this.state.description,
        };
        await fireService.addAnnotation(value, this.state.map.key);
        await this.getAnnotation();
        this.setState({modalAnnotation: false});
      } else {
        let value = {
          AnnotationName: this.state.name,
          longitude: parseFloat(this.state.longitude),
          latitude: parseFloat(this.state.latitude),
          statut : false
        };
        await fireService.addAnnotation(value, this.state.map.key);
        await this.getAnnotation();
        this.setState({modalAnnotation: false});
      }
    } else {
      alert('either you have a wrong information or you must fulfill the form');
    }
  }
  async getAnnotation() {
    if (this.state.map) {
      await fireService.getAnnotation(this.state.map.key).then(Annotation => {
        if (!Annotation['error']) {
          this.setState({Annotation: Annotation});
        }
      });
    }
  }
  async showAnnotation(annotationKey) {
    await fireService.updateStatutAnnotation(annotationKey, this.state.Annotation, this.state.map.key);
    this.getAnnotation();
  }
  async showUser() {
   await fireService.showUser(this.state.map.key, this.state.Annotation);
   this.getAnnotation();
  }
  render() {
    if (this.state.render === false) {
      return (
        <View style={(loadingStyle.container, loadingStyle.horizontal)}>
          <ActivityIndicator size="large" color="#e15f41" />
        </View>
      );
    } else {
      if (this.state.map === null) {
        return (
          <View style={styleNoMap.container}>
            <TouchableOpacity
              onPress={this.props.navigation.toggleDrawer}
              style={styleNoMap.buttonContainer}>
              <Image
                style={styleNoMap.addMapImage}
                source={require('./../assets/icon/AddMap.png')}
              />
              <Text>Start by creating a new map </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        let Annotation;
        let AnnotationMap;
        let visibleAnnotation;
        let IconUser;
        let UserLocation = (
          <MapboxGL.UserLocation renderMode="normal" visible={true} />
        );
        if (this.state.Annotation !== null) {
          AnnotationMap = this.state.Annotation.map(A => {
            return (
              <MapboxGL.PointAnnotation
                key={A.key}
                id="pointAnnotation"
                onSelected={() => alert(A.description)}
                coordinate={[A.longitude, A.latitude]}>
                <View style={styles.annotationContainer}>
                  <View style={styles.annotationFill} />
                </View>
                <MapboxGL.Callout title={A.AnnotationName} />
              </MapboxGL.PointAnnotation>
            );
          });
          Annotation = this.state.Annotation.map(value => {
            if(value.statut === true) {
              return (
                <View
                  key={value.key}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 20,
                    borderTopWidth : 1,
                    borderTopColor : 'white'
                  }}>
                  <TouchableOpacity onPress={() => this.showAnnotation(value.key)}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={require('./../assets/icon/AnnotationIcon.png')}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 15,
                        }}>
                        {value.AnnotationName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <View
                  key={value.key}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <TouchableOpacity onPress={() => this.showAnnotation(value.key)}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={require('./../assets/icon/AnnotationIcon.png')}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 15,
                        }}>
                        {value.AnnotationName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }
          });
          visibleAnnotation = this.state.Annotation.map((A,i) => {
            if(A.statut === true) {
              return (
                <MapboxGL.Camera key={A.key} zoomLevel={16} centerCoordinate={[A.longitude, A.latitude]}/>
              )
            } else if ( i === (this.state.Annotation.length - 1)) {
                return (
                <MapboxGL.Camera zoomLevel={16} followUserLocation={true}/>
              )
            }
          })
          if(this.state.userVisible === true) {
            IconUser = (
              <View
                  style={{flexDirection: 'column', justifyContent: 'center', borderLeftColor : 'white', borderLeftWidth : 1, padding : 5}}>
                  <TouchableOpacity onPress={() => this.showUser()}>
                    <Image source={require('./../assets/icon/UserSelect.png')} />
                  </TouchableOpacity>
                </View>
            )
          } else {
            IconUser = (
              <View
                  style={{flexDirection: 'column', justifyContent: 'center', borderLeftColor : 'white', borderLeftWidth : 1, padding : 5}}>
                  <TouchableOpacity onPress={() => this.showUser()}>
                    <Image source={require('./../assets/icon/User.png')} />
                  </TouchableOpacity>
                </View>
            )
          }
         }
        return (
          <View style={styles.container}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalAnnotation}
              coverScreen={true}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              {/* <ScrollView> */}
                <View style={modalStyle.container}>
                  <Image
                    style={modalStyle.logo}
                    source={require('./../assets/images/Logo2.png')}
                  />
                  <Text style={modalStyle.description}>
                    fullfil the inputs to add a Annotation
                  </Text>
                  <View style={modalStyle.inputContainer}>
                    <Image
                      style={modalStyle.inputIcon}
                      source={require('./../assets/icon/AnnotationName.png')}
                    />
                    <TextInput
                      style={modalStyle.inputs}
                      placeholder="name of the Annotation"
                      keyboardType="default"
                      underlineColorAndroid="transparent"
                      placeholderTextColor="black"
                      onChangeText={name => this.setState({name})}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={modalStyle.inputContainer2}>
                      <Image
                        style={modalStyle.inputIcon}
                        source={require('./../assets/icon/longitude.png')}
                      />
                      <TextInput
                        style={modalStyle.inputs}
                        placeholder="longitude"
                        keyboardType="number-pad"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        onChangeText={longitude => this.setState({longitude})}
                      />
                    </View>
                    <View style={modalStyle.inputContainer2}>
                      <Image
                        style={modalStyle.inputIcon}
                        source={require('./../assets/icon/latitude.png')}
                      />
                      <TextInput
                        style={modalStyle.inputs}
                        placeholder="latitude"
                        keyboardType="number-pad"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        onChangeText={latitude => this.setState({latitude})}
                      />
                    </View>
                  </View>
                  <View style={modalStyle.inputContainer3}>
                    <Image
                      style={modalStyle.inputIcon}
                      source={require('./../assets/icon/descriptionIcon.png')}
                    />
                    <TextInput
                      style={modalStyle.inputs}
                      multiline={true}
                      numberOfLines={10}
                      placeholder="description (optional)"
                      placeholderTextColor="black"
                      keyboardType="default"
                      onChangeText={description => this.setState({description})}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.addAnnotation()}>
                      <Image
                        style={{margin: 20}}
                        source={require('./../assets/icon/addVerif.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setModalVisible(false)}>
                      <Image
                        style={{margin: 20}}
                        source={require('./../assets/icon/removeMap.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              {/* </ScrollView> */}
            </Modal>
            <View style={styles.map}>
              <MapboxGL.MapView
                zoomEnabled={true}
                rotateEnabled={false}
                styleURL={MapboxGL.StyleURL.Street}
                userTrackingMode={true}
                zoomLevel={16}
                centerCoordinate={[11.256, 43.77]}
                style={styles.container}>
                {UserLocation}
                {visibleAnnotation}
                {AnnotationMap}
              </MapboxGL.MapView>
            </View>
            <View
              style={{
                padding: 7,
                backgroundColor: '#e15f41',
                flexDirection : 'row'
              }}>
                <View
                  style={{flexDirection: 'column', justifyContent: 'center' ,borderRightWidth : 1, borderRightColor : 'white', padding : 5}}>
                  <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                    <Image source={require('./../assets/icon/add.png')} />
                  </TouchableOpacity>
                </View>
              <ScrollView horizontal={true}>
                {Annotation}
              </ScrollView>
              {IconUser}
            </View>
          </View>
        );
      }
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e15f41',
    transform: [{scale: 0.6}],
  },
});
const styleNoMap = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMapImage: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    borderRadius: 30,
  },
});
const modalStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe4ea',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  description: {
    marginBottom: 20,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: '#e15f41',
    backgroundColor: '#dfe4ea',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer2: {
    borderBottomColor: '#e15f41',
    backgroundColor: '#dfe4ea',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 150,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer3: {
    borderBottomColor: '#e15f41',
    backgroundColor: '#dfe4ea',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 64,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#e15f41',
    flex: 1,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  signupButton: {
    backgroundColor: '#e15f41',
  },
  signUpText: {
    color: 'white',
  },
});
const loadingStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop : 50
  },
});
export default dashboardScreen;
