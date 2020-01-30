import React from 'react';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, View, StyleSheet, Text} from 'react-native';
class authGuardScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    await auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('dashboard');
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }
  render() {
      return (
        <View style={(styles.container, styles.horizontal)}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }   
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
export default authGuardScreen;
