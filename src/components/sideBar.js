// loading dependencies
import React from 'react';
import {Text} from 'react-native';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  TextInput,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import {fireService} from './../services/fireService';
// loading screens
import dashboardScreen from './dashboard';
// routes config
class SideBarScreen extends React.Component {
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('./../assets/icon/homeIcon.png')}
            style={{width: 25, height: 25, marginLeft: 5}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const Dashboard = createStackNavigator({
  First: {
    screen: dashboardScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Dashboard',
      headerLeft: () => <SideBarScreen navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#e15f41',
      },
      headerTintColor: 'black',
    }),
  },
});
class sideBarContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: [],
      inputData: '',
      User: null,
      maps: null,
      logo : ''
    };
  }
  componentDidMount() {
    this.fireInit();
  }
  async fireInit() {
    await fireService.getUserData().then(user => {
      if (!user['error']) {
        this.setState({User: user.email});
        this.getMaps();
        this.getFirstCaratere(this.state.User)
      } else {
        fireService.UserInit();
        this.fireInit();
      }
    });
  }
  addTextInput = indexInput => {
    let textInput = this.state.textInput;
    if (indexInput === 0) {
      textInput.push(
        <View key={textInput}>
          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={require('./../assets/icon/mapInput.png')}
            />
            <TextInput
              style={styles.inputs}
              placeholder="add your map name "
              underlineColorAndroid="transparent"
              onChangeText={inputData => this.setState({inputData})}
            />
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.addValues()}
                style={{marginRight: 20}}>
                <Image
                  style={{width: 35, height: 35}}
                  source={require('./../assets/icon/addVerif.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.removeTextInput()}>
                <Image
                  style={{width: 35, height: 35}}
                  source={require('./../assets/icon/removeMap.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>,
      );
      this.setState({textInput});
    }
  };
  addValues = async () => {
    if (this.state.inputData !== '') {
      let Name = {mapName: this.state.inputData, Annotation: [], statut: false};
      this.addValueToDataBase(Name);
    } else {
      alert('you must give a name ');
    }
  };
  addValueToDataBase = async value => {
    await fireService.addNewMapName(value);
    this.getMaps();
    this.removeTextInput();
  };
  removeTextInput = () => {
    this.setState({textInput: [], inputData: ''});
  };
  logOut = async () => {
    await fireService.logOut(this.props.navigation);
  };
  async getMaps() {
    await fireService.getNewMapName().then(maps => {
      if (!maps['error']) {
        this.setState({maps: maps});
      }
    });
  }
  async updateStatut(key) {
    await fireService.updateStatut(key, this.state.maps);
    this.getMaps();
    this.props.navigation.closeDrawer();
  }
  getFirstCaratere(name) {
    let N =  name.toUpperCase();
    this.setState({logo : N[0]})
  }
  render() {
    let maps;
    if (this.state.maps == null) {
      maps = <Text>No data</Text>;
    } else {
      maps = this.state.maps
        .slice(0)
        .reverse()
        .map(value => {
          if (value.statut === true) {
            return (
              <TouchableOpacity
                onPress={() => this.updateStatut(value.key)}
                key={value.key}>
                <View style={styles.inputContainer2}>
                  <Image
                    style={styles.inputIcon}
                    source={require('./../assets/icon/mapInput.png')}
                  />
                  <Text style={styles.mapName}>{value.mapName}</Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              onPress={() => this.updateStatut(value.key)}
              key={value.key}>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputIcon}
                  source={require('./../assets/icon/mapInput.png')}
                />
                <Text style={styles.mapName}>{value.mapName}</Text>
              </View>
            </TouchableOpacity>
          );
        });
    }
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'cover',
            backgroundColor: '#dfe4ea',
          }}>
            <View style={{borderColor : '#e15f41', borderWidth : 2, padding : 20, borderRadius : 50, backgroundColor : '#e15f41', marginTop : 40}}>
           <Text style={{color : 'white', fontSize : 15}}>{this.state.logo}</Text>
            </View>
           <Text style={{color : '#e15f41', margin : 10}}>{this.state.User}</Text>
          </View>
        <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
          <View
            style={{
              padding: 10,
              backgroundColor: '#e15f41',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white', marginTop: 7}}>Maps list</Text>
            <TouchableOpacity
              onPress={() => this.addTextInput(this.state.textInput.length)}>
              <Image
                style={{width: 30, height: 30}}
                source={require('./../assets/icon/add.png')}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={{backgroundColor: '#dfe4ea'}}>
            {this.state.textInput.map(value => {
              return value;
            })}
            {maps}
          </ScrollView>
        </SafeAreaView>
        <TouchableOpacity onPress={() => this.logOut()}>
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              backgroundColor: '#e15f41',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              style={{width: 30, height: 30, marginRight: 7}}
              source={require('./../assets/icon/iconLogOut.png')}
            />
            <Text style={{color: 'white', marginTop: 7}}>LOG OUT</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const DashboardNavigation = createDrawerNavigator(
  {
    dashboard: {
      screen: Dashboard,
    },
  },
  {
    contentComponent: sideBarContent,
  },
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
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
    borderBottomColor: 'blue',
    backgroundColor: '#dfe4ea',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  mapName: {
    fontSize: 18,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#E9A826',
  },
  loginText: {
    color: 'white',
  },
  Atext: {
    color: '#E9A826',
  },
});
export default DashboardNavigation;
