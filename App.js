/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
// loading dependencies
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// loading screens
import loginScreen from './src/auth/login';
import registerScreen from './src/auth/register';
import forgetPasswordScreen from './src/auth/forgetPassword';
import DashboardNavigation from './src/components/sideBar';
import authGuardScreen from './src/guard/authGuard';

// loading routes
const authNavigation = createStackNavigator(
  {
    Login: {
      screen: loginScreen,
    },
    Register: {
      screen: registerScreen,
    },
    forgetPassword: {
      screen: forgetPasswordScreen,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);
const GuardNavigation = createStackNavigator({
  authGuard: {
    screen: authGuardScreen,
  }
});
 

const rootNavigation = createSwitchNavigator(
  {
    
    Guard : GuardNavigation,
    components : DashboardNavigation,
    auth : authNavigation,
    
  }
)
export default createAppContainer(rootNavigation);
