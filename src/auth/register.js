import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {fireService} from './../services/fireService';

class registerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email :'',
          password : '',
        }
    }
    render() {
      return (
        <View style={styles.container}>
          <Image style={styles.logo} source={require('./../assets/images/Logo2.png')}/>
          <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('./../assets/icon/iconEmail2.png')}/>
            <TextInput style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({email})}/>
          </View>
          
          <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('./../assets/icon/iconPassword2.png')}/>
            <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
          </View>
  
          <TouchableOpacity onPress={() => {this.register(this.state.email,this.state.password)}} style={[styles.buttonContainer, styles.loginButton]}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {this.props.navigation.navigate('Login')}} style={styles.buttonContainer}>
              <Text style={styles.Atext}>I have a Account </Text>
          </TouchableOpacity>
        </View>
      );
    }
    async register(email, password) {
      if (email !== '' && password !== '') {
          if (this.emailValidation(email) && this.passwordValidation(password)) {
            try {
              await auth().createUserWithEmailAndPassword(email, password).then(() => {
                this.props.navigation.navigate('Login');
              });
            } catch (e) {
              console.error(e.message);
            }
          }
      } else {
        alert('you must insert all information');
      }
        
      }
      emailValidation(email) {
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regexEmail.test(email)) {
          return true;
        } else {
        alert('your Email is Invalid');
        return false;
        }
      }
      passwordValidation(password) {
        const lowerCase = /[a-z]/;
        const upperCase = /[A-Z]/;
        const number = /[0-9]/;
        if (!lowerCase.test(password)) {
          alert('Your Password must have a minimum of 1 lowerCase letter');
          return false;
        }
        if (!upperCase.test(password)) {
          alert('Your Password must have a minimum of 1 UpperCase letter');
          return false;
        }
        if (!number.test(password)) {
          alert('your Password must have at least one number');
          return false;
        }
        return true;
      }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode : 'cover',
    backgroundColor : '#dfe4ea'
  },
  logo : {
    width : 170,
    height : 170,
    marginBottom : 20
  },
  inputContainer: {
      borderBottomColor: '#e15f41',
      backgroundColor: '#dfe4ea',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#e15f41",
  },
  loginText: {
    color: 'white',
  }, 
  Atext : {
    color : '#e15f41'
  }
});
export default registerScreen;