import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigators/MainNavigator';


const App = () => {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
