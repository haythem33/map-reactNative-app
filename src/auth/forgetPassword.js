import React from 'react';
import {
  Modal,
  Alert,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';

class forgetPasswordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : ''
        }
    }
  render() {
      return(
        <View style={modalStyle.container}>
        <Image style={modalStyle.logo} source={require('./../assets/images/Logo2.png')}/>
        <Text style={modalStyle.description}>A link to reset your password will be send to this email</Text>
        <View style={modalStyle.inputContainer}>
        <Image style={modalStyle.inputIcon} source={require('./../assets/icon/iconEmail2.png')}/>
          <TextInput
            style={modalStyle.inputs}
            placeholder="Your email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={email => this.setState({email})}
          />
        </View>
  
        <TouchableHighlight
          style={[modalStyle.buttonContainer, modalStyle.signupButton]}
          onPress={() => this.sendLink(this.state.email)}>
          <Text style={modalStyle.signUpText}>Send</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[modalStyle.buttonContainer, modalStyle.signupButton]}
          onPress={() => {this.props.navigation.navigate('Login')}}>
          <Text style={modalStyle.signUpText}>return</Text>
        </TouchableHighlight>
      </View>
      )
  }
  async sendLink(email) {
      return auth().sendPasswordResetEmail(email).then((statut) => {
        if(statut) {
          alert('a link to reset your password');
          this.props.navigation.navigate('Login')
        } 
      });
  }
}
const modalStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe4ea',
  },
  logo : {
    width : 170,
    height : 170,
    marginBottom : 20
  },
  description : {
      marginBottom : 20
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
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
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
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
export default forgetPasswordScreen;
