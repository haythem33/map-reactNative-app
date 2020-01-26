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
    };
  }
  async componentDidMount() {
    this.fireInit();
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/users/${uid}/maps/`);
    ref.on('value', async () => {
      await fireService.getDashoardMap().then(map => {
        this.setState({map: map});
      });
    });
  }
  setModalVisible(visible) {
    this.setState({modalAnnotation: visible});
  }
  async fireInit() {
    await fireService.getUserData().then(user => {
      if (!user['error']) {
        this.setState({User: user.email});
        this.getMap();
      } else {
        fireService.UserInit();
        this.fireInit();
      }
    });
  }
  renderAnnotations() {
    return (
      <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={[11.254, 43.772]}>
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <MapboxGL.Callout title="An annotation here!" />
      </MapboxGL.PointAnnotation>
    );
  }
  async getMap() {
    await fireService.getDashoardMap().then(map => {
      this.setState({map: map});
    });
  }
  render() {
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
                  onChangeText={name => this.setState({name})}
                />
              </View>
			  <View style={{flexDirection : 'row'}}>
              <View style={modalStyle.inputContainer2}>
				<Image style={modalStyle.inputIcon} source={require('./../assets/icon/longitude.png')}/>
                <TextInput
                  style={modalStyle.inputs}
                  placeholder="longitude"
                  keyboardType="number-pad"
                  underlineColorAndroid="transparent"
                  onChangeText={longitude => this.setState({longitude})}
                />
              </View>
			  <View style={modalStyle.inputContainer2}>
			  <Image style={modalStyle.inputIcon} source={require('./../assets/icon/latitude.png')}/>
			  <TextInput
                  style={modalStyle.inputs}
                  placeholder="latitude"
                  keyboardType="number-pad"
                  underlineColorAndroid="transparent"
                  onChangeText={latitude => this.setState({latitude})}
                />
			  </View>
			  </View>
			  <View style={modalStyle.inputContainer3}>
				  <Image style={modalStyle.inputIcon} source={require('./../assets/icon/descriptionIcon.png')}/>
				  <TextInput style={modalStyle.inputs} multiline={true}
							numberOfLines={10}
							placeholder='description (optional)'
							keyboardType='default'
							onChangeText={description => this.setState({description})}/>
			  </View>

              <TouchableOpacity
                style={[modalStyle.buttonContainer, modalStyle.signupButton]}>
                <Text style={modalStyle.signUpText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyle.buttonContainer, modalStyle.signupButton]}
                onPress={() => this.setModalVisible(false)}>
                <Text style={modalStyle.signUpText}>return</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={styles.map}>
            <MapboxGL.MapView
              zoomEnabled={true}
              styleURL={MapboxGL.StyleURL.Street}
              zoomLevel={15}
              centerCoordinate={[11.256, 43.77]}
              style={styles.container}>
              {this.renderAnnotations()}
            </MapboxGL.MapView>
          </View>
          <View
            style={{
              padding: 15,
              backgroundColor: '#e15f41',
            }}>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                  <Image
                    source={require('./../assets/icon/AnnotationIcon.png')}
                  />
                  <Text style={{color: 'white', fontSize: 17, marginTop: 10}}>
                    qsdqs
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
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
    flexDirection: 'column',
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
export default dashboardScreen;
