import { Platform } from 'react-native';
import { MediaStreamTrack } from 'react-native-webrtc';
import getUserMedia from 'react-native-webrtc/getUserMedia';

export const getLocalStreamDevice = async isFront => {
  let videoSourceId;

  if (Platform.OS === 'ios') {
    const sourceInfos = await MediaStreamTrack.getSources();

    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];

      if (
        sourceInfo.kind == 'video' &&
        sourceInfo.facing == (isFront ? 'front' : 'back')
      ) {
        videoSourceId = sourceInfo.id;
      }
    }
  }
  debugger;
  return getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: isFront ? 'user' : 'environment',
      optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
    },
  });
};
