import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';
import auth from '@react-native-firebase/auth';

class loginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : ''
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

        <TouchableOpacity onPress={() => {this.login(this.state.email,this.state.password)}} style={[styles.buttonContainer, styles.loginButton]}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {this.props.navigation.navigate('forgetPassword')}} style={styles.buttonContainer}>
            <Text style={styles.Atext}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Register')}} style={styles.buttonContainer}>
            <Text style={styles.Atext}>I don't have a account </Text>
        </TouchableOpacity>
      </View>
    )
}
async login(email,password) {
  if (this.state.email !== '' && this.state.password !== '') {
    try {
      await auth().signInWithEmailAndPassword(email,password);
      this.props.navigation.navigate('Dashboard')
  } catch (e) {
       if(e) {
         alert('invalid information')
       }
  }  
  } else {
    alert('you must insert all information');
  } 
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
export default loginScreen
