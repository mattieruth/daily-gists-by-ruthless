const DAILY_SRC = {
  local: '../daily.js',
  latest: 'https://unpkg.com/@daily-co/daily-js',
  versioned: 'http://unpkg.com/@daily-co/daily-js@',
};

function importDaily(from) {
  let daily_script_tag = document.createElement('script');
  let src = DAILY_SRC[from] || DAILY_SRC.versioned + from;
  if (from === 'local' && window.location.href.includes('basic-call-object')) {
    src = './daily.js';
  }
  daily_script_tag.setAttribute('src', src);
  document.head.appendChild(daily_script_tag);
}

// Uncomment and update the line to specify where you want to import from.
// importDaily('0.58.0');
importDaily('latest');
// importDaily('local');

let callObjectMode;

function isCallObjectMode() {
  if (callObjectMode === undefined) {
    const urlParams = new URLSearchParams(window.location.search);
    callObjectMode = !urlParams.has('prebuilt');
  }
  return callObjectMode;
}

function createDailyInstance(dailyConfig) {
  if (!dailyConfig) {
    dailyConfig = { userName: 'jackie joiner' };
  }
  let call;
  if (isCallObjectMode()) {
    call = DailyIframe.createCallObject(dailyConfig);
    call.on('track-started', displayTrack);
    call.on('track-stopped', destroyTrack);
    call.on('joined-meeting', handleJoin);
    call.on('participant-updated', logEvent);
    // call.on("recording-started", logEvent);
    // call.on("recording-stopped", logEvent);
    // call.on("network-connection", logEvent);
    // call.on("participant-left", handleParticipantLeft);
    // call.on("participant-joined", handleParticipantJoined);
    // call.on("meeting-session-updated", logEvent);
  } else {
    let iframe = document.createElement('call-iframe-container');
    document.body.appendChild(iframe);
    call = DailyIframe.createFrame(iframe, dailyConfig);
  }
  window.call = call;
  call.on('active-speaker-change', (e) =>
    console.log('active speaker change event', e.activeSpeaker.peerId)
  );
  call.on('error', (e) => {
    console.error('DAILY SENT AN ERROR!', e);
    if (e.error?.details?.sourceError) {
      console.log('Original Error', e.error?.details?.sourceError);
    }
  });
  return call;
}

function startScreenShare() {
  call.startScreenShare();
}

function displayTrack(evt) {
  console.log('!!! TRACK STARTED', evt);
  if (evt.track.kind === 'video') {
    displayVideo(evt);
  } else {
    playAudio(evt);
  }
}

function displayVideo(evt) {
  console.log(evt);
  let videosDiv = document.getElementById('videos');
  let videoEl = document.createElement('video');
  videosDiv.appendChild(videoEl);
  videoEl.style.width = '100%';
  videoEl.srcObject = new MediaStream([evt.track]);
  let p = videoEl.play();
  p.then(() => {
    // all good
  }).catch((e) => {
    console.error('Error trying to play() video', e);
  });
}

async function playAudio(evt) {
  if (evt.participant.local) {
    return;
  }
  let audioEl = document.createElement('audio');
  document.body.appendChild(audioEl);
  audioEl.srcObject = new MediaStream([evt.track]);
  try {
    await audioEl.play();
  } catch (e) {
    console.error('Error trying to play() audio', e);
  }
}

function destroyTrack(evt) {
  console.log(
    '!!! TRACK STOPPED',
    evt.kind,
    evt.participant && evt.participant.session_id
  );
  let videosDiv = document.getElementById('videos');
  let els = Array.from(videosDiv.getElementsByTagName('video')).concat(
    Array.from(document.getElementsByTagName('audio'))
  );
  for (let el of els) {
    if (el.srcObject && el.srcObject.getTracks()[0] === evt.track) {
      el.remove();
      el.srcObject = null;
    }
  }
}

async function aTimeout(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

async function join(opts) {
  if (!opts) {
    opts = { url: window.ROOM_URL };
  }
  try {
    console.log('JOIN ', window.ROOM_URL);
    await call.join(opts);
  } catch (e) {
    console.error('join failed!', e);
  }
}

async function joinWithToken(opts) {
  if (!opts) {
    opts = { url: window.ROOM_URL, token: window.JOIN_TOKEN };
  }
  try {
    console.log('JOIN WITH TOKEN ', window.ROOM_URL);
    await call.join(opts);
  } catch (e) {
    console.error(`join failed!: ${e}`);
  }
}

function handleJoin(e) {
  console.log('!! i joined!', e);
  // console.log('!! participant counts', call.participantCounts());
}

function leave() {
  call.leave();
}

function logEvent(evt) {
  console.log('DAILY EVENT!');
  console.log(evt);
  console.log('-----------');
}
