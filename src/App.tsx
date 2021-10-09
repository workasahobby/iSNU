import {NavigationContainer} from '@react-navigation/native';
import {Box, Flex, NativeBaseProvider, HStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Dimensions} from 'react-native';
import Cafe from './screens/Cafe';
import type {Cafe as CafeType} from './screens/Cafe';
import type {Mart as MartType} from './screens/Mart';
import Etcs from './screens/Etcs';
import Mart from './screens/Mart';
import Meal from './screens/Meal';
import Shuttle from './screens/Shuttle';
import CafeIcon from './icons/cafe.svg';
import EtcsIcon from './icons/etcs.svg';
import MartIcon from './icons/mart.svg';
import MealIcon from './icons/meal.svg';
import ShuttleIcon from './icons/shuttle.svg';
import {colors} from './ui/colors';
import SplashScreen from 'react-native-splash-screen';
import {theme} from './ui/theme';
import {initializeData} from './InitializeData';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import {slack} from './helpers/axios';
import {MealData} from './InitializeData/ProcessMealData';
import {Awaited} from './helpers/type';
import MoreModal from './components/MoreModal';
import amplitude from './helpers/amplitude';
import {Icon} from 'react-native-vector-icons';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Text from './components/Text';
import {gridAutoColumns} from 'styled-system';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [data, setData] = useState<Awaited<
    ReturnType<typeof initializeData>
  > | null>(null);

  useEffect(() => {
    initializeData().then(initializedData => {
      setData(initializedData);
      SplashScreen.hide();
    });
  }, []);
  return (
    <NativeBaseProvider theme={theme}>
      <Box width="100%" height="100%" safeArea>
        {data ? (
          <>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName={'Mart'}
                tabBarPosition="bottom"
                screenOptions={({route}) => ({
                  // console.log(route)
                  // headerStatusBarHeight: 100,
                  // headerTitleStyle: {
                  //   color: colors.blue,
                  //   fontSize: 40,
                  //   marginLeft: 12,
                  //   top: '0%',
                  //   height: '150%',
                  // },
                  // headerTitleAlign: 'left',
                  // headerStyle: {borderBottomWidth: 0, height: 140},
                  // headerTitleContainerStyle: {paddingBottom: 10},
                  // headerRight: () => <MoreModal />,
                  tabBarStyle: {
                    height: 60,
                    borderTopColor: '#DCDCDC',
                    borderTopWidth: 1,
                  },
                  tabBarIconStyle: {
                    alignItems: 'center',
                  },
                  tabBarItemStyle: {
                    top: -5,
                  },
                  tabBarIndicatorStyle: {
                    height: 0,
                  },
                })}>
                <Tab.Screen
                  name="식당"
                  options={{
                    tabBarIcon: () => <MealIcon />,
                  }}
                  listeners={{
                    tabPress: e => {
                      amplitude.logEvent('meal');
                    },
                  }}>
                  {props => (
                    <Box>
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="15px"
                        px={windowWidth * 0.075}>
                        <Text variant="pageTitle">식당</Text>
                        <MoreModal />
                      </HStack>
                      <Meal {...props} mealData={data.mealData} />
                    </Box>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="카페"
                  options={{
                    tabBarIcon: () => <CafeIcon />,
                  }}
                  listeners={{
                    tabPress: e => {
                      amplitude.logEvent('cafe');
                    },
                  }}>
                  {props => (
                    <Box>
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="15px"
                        px={windowWidth * 0.075}>
                        <Text variant="pageTitle">카페</Text>
                        <MoreModal />
                      </HStack>
                      <Cafe
                        {...props}
                        cafes={data.cafeData}
                        initialFavoriteNames={data.favoriteCafes}
                      />
                    </Box>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="편의점"
                  options={{
                    tabBarIcon: () => <MartIcon />,
                  }}
                  listeners={{
                    tabPress: e => {
                      amplitude.logEvent('mart');
                    },
                  }}>
                  {props => (
                    <Box>
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="15px"
                        px={windowWidth * 0.075}>
                        <Text variant="pageTitle">편의점</Text>
                        <MoreModal />
                      </HStack>
                      <Mart
                        {...props}
                        marts={data.martData}
                        initialFavoriteNames={data.favoriteMarts}
                      />
                    </Box>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="셔틀"
                  options={{
                    tabBarIcon: () => <ShuttleIcon />,
                  }}
                  listeners={{
                    tabPress: e => {
                      amplitude.logEvent('shuttle');
                    },
                  }}>
                  {props => (
                    <Box>
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="15px"
                        px={windowWidth * 0.075}>
                        <Text variant="pageTitle">셔틀</Text>
                        <MoreModal />
                      </HStack>
                      <Shuttle
                        {...props}
                        initialFavoriteNames={data.favoriteShuttles}
                      />
                    </Box>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="기타"
                  options={{
                    tabBarIcon: () => <EtcsIcon />,
                  }}
                  listeners={{
                    tabPress: e => {
                      amplitude.logEvent('etcs');
                    },
                  }}>
                  {props => (
                    <Box>
                      <HStack
                        flexDir="row"
                        bg={theme.colors.white}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        paddingTop="15px"
                        px={windowWidth * 0.075}>
                        <Text variant="pageTitle">기타</Text>
                        <MoreModal />
                      </HStack>
                      <Etcs />
                    </Box>
                  )}
                </Tab.Screen>
                {/* <Tab.Screen
                  name="기타"
                  component={Etcs}
                  options={{
                    tabBarIcon: () => <EtcsIcon />,
                  }}
                  listeners={{
                    tabPress: e => {
                      amplitude.logEvent('etcs');
                    },
                  }}
                /> */}
              </Tab.Navigator>
            </NavigationContainer>
          </>
        ) : null}
      </Box>
    </NativeBaseProvider>
  );
}
