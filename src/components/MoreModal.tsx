import {
  Box,
  Center,
  Modal,
  Pressable,
  TextArea,
  VStack,
  HStack,
} from 'native-base';
import React, {useCallback, useState} from 'react';
import {Keyboard, Dimensions, Linking} from 'react-native';
import getPublicIp from 'react-native-public-ip';
import Button from './Button';
import Text from './Text';

import {slack} from '../helpers/axios';
import More from '../icons/more.svg';
import MorePressed from '../icons/more-pressed.svg';
import Outlink from '../icons/outlink.svg';
import OutlinkPressed from '../icons/outlink-pressed.svg';
import Back from '../icons/back.svg';
import BackPressed from '../icons/back-pressed.svg';
import {theme} from '../ui/theme';

export default function MoreModal() {
  const [selectedMoreTap, setSelectedMoreTap] = useState<
    'tip' | 'suggest' | 'main' | 'submitTip' | 'submitSuggest' | null
  >(null);
  const [nextState, setNextState] = useState<'main' | null>(null);
  const [checkSubmit, setCheckSubmit] = useState<boolean>(false);
  const [checkClose, setCheckClose] = useState<boolean>(false);
  const [tipInput, setTipInput] = useState<string>('');
  const [suggestInput, setSuggestInput] = useState<string>('');
  const windowWidth = Dimensions.get('window').width;

  const handleSubmitSuggest = useCallback(async () => {
    setCheckSubmit(false);
    setSelectedMoreTap('submitSuggest');
    setSuggestInput('');
    try {
      const textLines = [`내용: ${suggestInput}`];

      await slack.post('', {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '기능 추가 건의',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: textLines.join('\n'),
            },
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  }, [suggestInput]);

  const handleSubmitTip = useCallback(async () => {
    setCheckSubmit(false);
    setSelectedMoreTap('submitTip');
    setTipInput('');
    try {
      const textLines = [`내용: ${tipInput}`];

      await slack.post('', {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '잘못된 정보 제보',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: textLines.join('\n'),
            },
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  }, [tipInput]);
  // const handleBack = useCallback(() => {
  //   setSelectedMoreTap('main');
  // }, []);

  const handleTipInput = useCallback((text: string) => {
    setTipInput(text);
  }, []);

  const handleSuggestInput = useCallback((text: string) => {
    setSuggestInput(text);
  }, []);

  function handleClose(preState: string) {
    switch (preState) {
      case 'main':
        return setSelectedMoreTap(null);
      case 'tip':
        if (!tipInput.trim()) {
          return setSelectedMoreTap(null);
        } else {
          setNextState(null);
          return setCheckClose(true);
        }
      case 'suggest':
        if (!suggestInput.trim()) {
          return setSelectedMoreTap(null);
        } else {
          setNextState(null);
          return setCheckClose(true);
        }
      case 'submitTip':
        return setSelectedMoreTap(null);
      case 'submitSuggest':
        return setSelectedMoreTap(null);
      case 'back':
        setNextState('main');
        if (selectedMoreTap === 'tip' && !!tipInput.trim()) {
          return setCheckClose(true);
        } else if (selectedMoreTap === 'suggest' && !!suggestInput.trim()) {
          return setCheckClose(true);
        } else {
          return setSelectedMoreTap('main');
        }
    }
  }

  return (
    <Box>
      <Pressable
        marginBottom="14px"
        marginRight={windowWidth * 0.075}
        padding="0"
        onPress={() => setSelectedMoreTap('main')}
        backgroundColor="transparent">
        {({isPressed}) => {
          return isPressed ? <MorePressed /> : <More />;
        }}
      </Pressable>

      <Modal
        top="-10%"
        isOpen={!!selectedMoreTap}
        onClose={() => handleClose(selectedMoreTap)}>
        <Modal.Content
          backgroundColor={theme.colors.white}
          padding={0}
          width="90%">
          {selectedMoreTap === 'main' && (
            <Modal.Body width="100%">
              <Modal.CloseButton onPress={() => console.log(selectedMoreTap)} />
              <Box margin="auto" my="5" alignItems="flex-end">
                <Pressable onPress={() => setSelectedMoreTap('tip')}>
                  {({isPressed}) => {
                    return (
                      <Center flexDirection="row" my="3">
                        <Text
                          marginLeft="auto"
                          marginRight="5px"
                          variant={
                            isPressed ? 'pressedModalTitle' : 'modalTitle'
                          }>
                          잘못된 정보 제보하기
                        </Text>
                        {isPressed ? <OutlinkPressed /> : <Outlink />}
                      </Center>
                    );
                  }}
                </Pressable>
                <Pressable onPress={() => setSelectedMoreTap('suggest')}>
                  {({isPressed}) => {
                    return (
                      <Center flexDirection="row" my="3">
                        <Text
                          marginLeft="auto"
                          marginRight="5px"
                          variant={
                            isPressed ? 'pressedModalTitle' : 'modalTitle'
                          }>
                          기능 추가 건의하기
                        </Text>
                        {isPressed ? <OutlinkPressed /> : <Outlink />}
                      </Center>
                    );
                  }}
                </Pressable>
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      'https://wobby.notion.site/wobby/We-Work-as-a-Hobby-9c6a1081ecbf4885902962c0998bfd2c',
                    )
                  }>
                  {({isPressed}) => {
                    return (
                      <Center flexDirection="row" my="3">
                        <Text
                          marginLeft="auto"
                          marginRight="5px"
                          variant={
                            isPressed ? 'pressedModalTitle' : 'modalTitle'
                          }>
                          개발자들 보러 가기
                        </Text>
                        {isPressed ? <OutlinkPressed /> : <Outlink />}
                      </Center>
                    );
                  }}
                </Pressable>
              </Box>
            </Modal.Body>
          )}
          {selectedMoreTap === 'tip' && (
            <Pressable onPress={Keyboard.dismiss}>
              <Box>
                <Modal.CloseButton onPress={() => handleClose('tip')} />
                <Modal.Header
                  borderColor={theme.colors.blue}
                  paddingLeft="20px"
                  display="flex"
                  flexDir="row">
                  <Pressable
                    onPress={() => handleClose('back')}
                    marginRight={2}>
                    {({isPressed}) => {
                      return isPressed ? <BackPressed /> : <Back />;
                    }}
                  </Pressable>
                  <Text variant="modalSubContent">잘못된 정보 제보하기</Text>
                </Modal.Header>
                <Modal.Body paddingTop="5">
                  <TextArea
                    height="102px"
                    value={tipInput}
                    onChangeText={handleTipInput}
                    _focus={{
                      borderColor: 'blue.100',
                    }}
                    placeholder="내용 입력하기"
                  />
                </Modal.Body>
                <Modal.Footer
                  backgroundColor={theme.colors.white}
                  paddingTop="0">
                  {/* <Button
                    onPress={() => handleClose('tip')}
                    variant="closeButton"
                    marginRight="10px">
                    <Text variant="closeButton">닫기</Text>
                  </Button> */}
                  <Button
                    onPress={() => setCheckSubmit(true)}
                    variant="submitButton"
                    isDisabled={!tipInput.trim()}>
                    <Text variant="submitButton">제출하기</Text>
                  </Button>
                </Modal.Footer>
              </Box>
            </Pressable>
          )}
          {selectedMoreTap === 'suggest' && (
            <Pressable onPress={Keyboard.dismiss}>
              <Box>
                <Modal.CloseButton onPress={() => handleClose('suggest')} />
                <Modal.Header
                  borderColor={theme.colors.blue}
                  paddingLeft="20px"
                  display="flex"
                  flexDir="row">
                  <Pressable
                    onPress={() => handleClose('back')}
                    marginRight={2}>
                    {({isPressed}) => {
                      return isPressed ? <BackPressed /> : <Back />;
                    }}
                  </Pressable>
                  <Text variant="modalSubContent">기능 추가 건의하기</Text>
                </Modal.Header>
                <Modal.Body paddingTop="5">
                  <TextArea
                    height="102px"
                    value={suggestInput}
                    onChangeText={handleSuggestInput}
                    _focus={{
                      borderColor: 'blue.100',
                    }}
                    placeholder="내용 입력하기"
                  />
                </Modal.Body>
                <Modal.Footer
                  backgroundColor={theme.colors.white}
                  paddingTop="0">
                  {/* <Button
                    onPress={() => handleClose('suggest')}
                    variant="closeButton"
                    marginRight="10px">
                    <Text variant="closeButton">닫기</Text>
                  </Button> */}
                  <Button
                    onPress={() => setCheckSubmit(true)}
                    variant="submitButton"
                    isDisabled={!suggestInput.trim()}>
                    <Text variant="submitButton">제출하기</Text>
                  </Button>
                </Modal.Footer>
              </Box>
            </Pressable>
          )}
          {selectedMoreTap === 'submitTip' && (
            <Box>
              <VStack>
                <Text>ㄱㅅㄱㅅ</Text>
                <Button onPress={() => setSelectedMoreTap(null)}>닫기</Button>
              </VStack>
            </Box>
          )}
          {selectedMoreTap === 'submitSuggest' && (
            <Box>
              <VStack>
                <Text>ㄱㅅㄱㅅ</Text>
                <Button onPress={() => setSelectedMoreTap(null)}>닫기</Button>
              </VStack>
            </Box>
          )}
        </Modal.Content>
      </Modal>
      <Modal
        top="-10%"
        isOpen={checkSubmit}
        onClose={() => setCheckSubmit(false)}>
        <Modal.Content>
          <Modal.Body />
          <VStack alignItems="center">
            <Box>
              <Text>제출할거임?</Text>
            </Box>
            <HStack>
              <Button onPress={() => setCheckSubmit(false)}>놉</Button>
              <Button
                onPress={
                  selectedMoreTap === 'suggest'
                    ? handleSubmitSuggest
                    : handleSubmitTip
                }>
                ㅇㅇ
              </Button>
            </HStack>
          </VStack>
        </Modal.Content>
      </Modal>
      <Modal
        top="-10%"
        isOpen={checkClose}
        onClose={() => setCheckClose(false)}>
        <Modal.Content>
          <Modal.Body />
          <VStack alignItems="center">
            <Box>
              <Text>뒤로 가시겠습니까?</Text>
              <Text>작성중인 내용이 저장되지 않고 사라집니다.</Text>
            </Box>
            <HStack>
              <Button
                onPress={() => {
                  setSelectedMoreTap(nextState);
                  setTipInput('');
                  setSuggestInput('');
                  setCheckClose(false);
                }}>
                ㅇㅇ 나감
              </Button>
              <Button onPress={() => setCheckClose(false)}>ㄴㄴ 안나감</Button>
            </HStack>
          </VStack>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
