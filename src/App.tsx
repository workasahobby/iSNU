import {NavigationContainer} from '@react-navigation/native';
import {Box, Flex, NativeBaseProvider, HStack, StatusBar} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, Dimensions, Platform} from 'react-native';
import Cafe from './screens/Cafe';
import Etcs from './screens/Etcs';
import Mart from './screens/Mart';
import Meal from './screens/Meal';
import Shuttle from './screens/Shuttle';
import CafeIcon from './icons/cafe.svg';
import EtcsIcon from './icons/etc.svg';
import MartIcon from './icons/mart.svg';
import MealIcon from './icons/meal.svg';
import ShuttleIcon from './icons/shuttle.svg';
import SplashScreen from 'react-native-splash-screen';
import {theme} from './ui/theme';
import {initializeData} from './InitializeData';
import {Awaited} from './helpers/type';
import MoreModal from './components/MoreModal';
import Text from './components/Text';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// eslint-disable-next-line import/default
import CodePush from 'react-native-code-push';
import IndicatorModal from './ui/IndicatorModal';
import {getNow} from './helpers/getNow';

const Tab = createBottomTabNavigator();

function App() {
  const windowWidth = Dimensions.get('window').width;
  const appState = useRef(AppState.currentState);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof initializeData>
  > | null>(null);
  const [nowDate, setNowDate] = useState<Date>(getNow());
  const [showActivityIndicator, setShowActivityIndicator] =
    useState<boolean>(false);

  useEffect(() => {
    initializeData().then(initializedData => {
      setData(initializedData);
      SplashScreen.hide();
    });
    AppState.addEventListener('change', nextAppState => {
      if (
        nextAppState === 'active' &&
        (appState.current === 'background' || appState.current === 'inactive')
      ) {
        setShowActivityIndicator(true);
        initializeData()
          .then(updatedData => {
            setData(updatedData);
            setNowDate(getNow());
          })
          .then(() => setShowActivityIndicator(false));
      }
      appState.current = nextAppState;
      console.log(nextAppState);
    });
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <Box width="100%" height="100%" safeArea backgroundColor="white">
        <StatusBar barStyle="dark-content" />
        {showActivityIndicator && <IndicatorModal />}
        {data ? (
          <>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName={'식당'}
                screenOptions={() => ({
                  headerShown: false,
                  tabBarActiveTintColor: '#0085FF',
                  tabBarInactiveTintColor: '#636363',
                  tabBarStyle: {
                    paddingTop: Platform.OS === 'android' ? 2 : 2,
                    paddingBottom: Platform.OS === 'android' ? 3 : 0,
                    height: Platform.OS === 'android' ? 62 : 52,
                    borderTopColor: '#DCDCDC',
                    borderTopWidth: 1,
                    borderBottomColor: '#DCDCDC',
                    borderBottomWidth: Platform.OS === 'android' ? 1 : 0,
                  },
                  tabBarLabelStyle: {
                    fontFamily: 'NotoSansCJKkr-Medium',
                    top: Platform.OS === 'android' ? -3 : -3,
                    // paddingBottom: 5,
                  },
                  tabBarIconStyle: {
                    // height: 30
                    // width: 45,
                    // alignItems: 'center',
                  },
                  showIcon: true,
                })}>
                <Tab.Screen
                  name="식당"
                  options={{
                    tabBarIcon: () => <MealIcon width="24px" height="24px" />,
                  }}>
                  {props => (
                    <Flex height="100%">
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="18px"
                        borderBottomWidth="1px"
                        borderColor={theme.colors.gray[300]}
                        paddingLeft={windowWidth * 0.075}>
                        <Text bottom="8px" variant="pageTitle">
                          식당
                        </Text>
                        <MoreModal />
                      </HStack>
                      <Box flex={1}>
                        <Meal
                          {...props}
                          mealData={data.mealData}
                          nowDate={nowDate}
                        />
                      </Box>
                    </Flex>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="카페"
                  options={{
                    tabBarIcon: () => <CafeIcon width="24px" height="24px" />,
                  }}>
                  {props => (
                    <Flex height="100%">
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="18px"
                        borderBottomWidth="1px"
                        borderColor={theme.colors.gray[300]}
                        paddingLeft={windowWidth * 0.075}>
                        <Text bottom="8px" variant="pageTitle">
                          카페
                        </Text>
                        <MoreModal />
                      </HStack>
                      <Box flex={1}>
                        <Cafe
                          {...props}
                          cafes={data.cafeData}
                          initialFavoriteNames={data.favoriteCafes}
                          nowDate={nowDate}
                        />
                      </Box>
                    </Flex>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="편의점"
                  options={{
                    tabBarIcon: () => <MartIcon width="24px" height="24px" />,
                  }}>
                  {props => (
                    <Flex height="100%">
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="18px"
                        borderBottomWidth="1px"
                        borderColor={theme.colors.gray[300]}
                        paddingLeft={windowWidth * 0.075}>
                        <Text bottom="8px" variant="pageTitle">
                          편의점
                        </Text>
                        <MoreModal />
                      </HStack>
                      <Box flex={1}>
                        <Mart
                          {...props}
                          marts={data.martData}
                          initialFavoriteNames={data.favoriteMarts}
                          nowDate={nowDate}
                        />
                      </Box>
                    </Flex>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="셔틀"
                  options={{
                    tabBarIcon: () => (
                      <ShuttleIcon width="24px" height="24px" />
                    ),
                  }}>
                  {props => (
                    <Flex height="100%">
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="18px"
                        borderBottomWidth="1px"
                        borderColor={theme.colors.gray[300]}
                        paddingLeft={windowWidth * 0.075}>
                        <Text bottom="8px" variant="pageTitle">
                          셔틀
                        </Text>
                        <MoreModal />
                      </HStack>
                      <Box flex={1}>
                        <Shuttle
                          {...props}
                          initialFavoriteNames={data.favoriteShuttles}
                          nowDate={nowDate}
                        />
                      </Box>
                    </Flex>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="기타"
                  options={{
                    tabBarIcon: () => <EtcsIcon width="35px" height="35px" />,
                  }}>
                  {() => (
                    <Flex height="100%">
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="18px"
                        borderBottomWidth="1px"
                        borderColor={theme.colors.gray[300]}
                        paddingLeft={windowWidth * 0.075}>
                        <Text bottom="8px" variant="pageTitle">
                          기타
                        </Text>
                        <MoreModal />
                      </HStack>
                      <Box flex={1}>
                        <Etcs />
                      </Box>
                    </Flex>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            </NavigationContainer>
          </>
        ) : null}
      </Box>
    </NativeBaseProvider>
  );
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: {
    title: 'iSNU 업데이트 안내',
    optionalUpdateMessage: '지금 업데이트 하시겠습니까?',
    optionalInstallButtonLabel: '업데이트',
    optionalIgnoreButtonLabel: '아니요.',
  },
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
