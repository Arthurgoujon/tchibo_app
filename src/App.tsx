import React from 'react';
import 'react-native-gesture-handler';
import {QueryClientProvider, QueryClient} from 'react-query';
import {Provider as ReduxProvider} from 'react-redux';
import {kadoStore} from './features/redux/store';
import {RootNav} from './features/navigation/RootNav';
import {FallBackComponent} from './features/deepLink/FallBackComponent';
import {CouponAppLinkingOptions} from './navigation';
import {StartupComponent} from './features/startup/StartupComponent';
import {NavigationContainer} from '@react-navigation/native';
import {MonkadoThemeProvider} from './features/theme/MonkadoThemeProvider';
import {useYellowTheme} from './features/theme/yellowTheme';

const queryCache = new QueryClient();

const App = () => {
  const yellowTheme = useYellowTheme();
  return (
    <ReduxProvider store={kadoStore}>
      <MonkadoThemeProvider theme={yellowTheme}>
        <QueryClientProvider client={queryCache}>
          <StartupComponent>
            <NavigationContainer linking={CouponAppLinkingOptions}>
              <RootNav />
            </NavigationContainer>
          </StartupComponent>
        </QueryClientProvider>
      </MonkadoThemeProvider>
    </ReduxProvider>
  );
};

export default App;
