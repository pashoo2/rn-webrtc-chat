import { mediaDevices } from 'react-native-webrtc';
import permissions from 'react-native-permissions';
/* TODO only android 6+ (api 23+) is supported */

export const getLocalStreamDevice = async isFront => {
  await permissions.request('camera');
  await permissions.request('microphone');

  const sourceInfos = await mediaDevices.enumerateDevices();
  let videoSourceId;

  for (let i = 0; i < sourceInfos.length; i++) {
    const sourceInfo = sourceInfos[i];
    const mediaLabel = isFront ? 'front' : 'back';

    if (
      sourceInfo.kind.toLowerCase().includes('video') &&
      ((sourceInfo.facing && sourceInfo.facing === mediaLabel) ||
        (sourceInfo.label &&
          sourceInfo.label.toLowerCase().includes(mediaLabel)))
    ) {
      videoSourceId = sourceInfo.deviceId || sourceInfo.id;
    }
  }
  return mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { min: 500 }, // Provide your own width, height and frame rate here
      height: { min: 300 },
      frameRate: { min: 15 },
      facingMode: isFront ? 'user' : 'environment',
      deviceId: videoSourceId ? videoSourceId : undefined,
    },
  });
};
