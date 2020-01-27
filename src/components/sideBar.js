// loading dependencies
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
// loading screens
import dashboardScreen from './dashboard';
import sideBarContent from './sideBarContent';
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
      headerTintColor: 'white',
    }),
  },
});
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
export default DashboardNavigation;
