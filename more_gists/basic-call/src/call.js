import DailyIframe from "@daily-co/daily-js";
import * as consts from "../../../_roomInfo";

export default class DailyCall {
  constructor() {
    this.setupCallInstance();
  }

  setupCallInstance() {
    this.call = DailyIframe.createCallObject();
    this.call.on("track-started", this.displayTrack.bind(this));
    this.call.on("track-stopped", this.destroyTrack.bind(this));
    this.call.on("joined-meeting", this.handleJoin.bind(this));
    this.call.on("participant-updated", this.logEvent.bind(this));
    this.call.on("error", (e) => {
      console.error("DAILY SENT AN ERROR!", e);
      if (e.error?.details?.sourceError) {
        console.log("Original Error", e.error?.details?.sourceError);
      }
    });
  }

  async join() {
    try {
      console.log("JOIN ", window.ROOM_URL);
      await this.call.join({
        url: window.ROOM_URL,
        // userData: { broadcastFrom: "CHANNEL" },
      });
      // await call.join({url: window.ROOM_URL});
    } catch (e) {
      console.error("join failed!", e);
    }
  }

  handleJoin(e) {
    console.log("!! i joined!", e);
  }

  leave() {
    console.log("LEAVE");
    this.call.leave();
    this.cleanupElements();
  }

  cleanupElements() {
    let vidDiv = document.getElementById("videos");
    vidDiv.replaceChildren();
  }

  displayTrack(evt) {
    console.log("!!! TRACK STARTED", evt);
    if (evt.track.kind === "video") {
      this.displayVideo(evt);
    } else {
      this.playAudio(evt);
    }
  }

  displayVideo(evt) {
    console.log(evt);
    let videosDiv = document.getElementById("videos");
    let videoEl = document.createElement("video");
    videosDiv.appendChild(videoEl);
    // videoEl.style.width = "100%";
    videoEl.srcObject = new MediaStream([evt.track]);
    videoEl.play();
  }

  playAudio(evt) {
    if (evt.participant.local) {
      return;
    }
    let audioEl = document.createElement("audio");
    document.body.appendChild(audioEl);
    audioEl.srcObject = new MediaStream([evt.track]);
    audioEl.play();
  }

  destroyTrack(evt) {
    console.log(
      "!!! TRACK STOPPED",
      evt.kind,
      evt.participant && evt.participant.session_id
    );
    let els = Array.from(document.getElementsByTagName("video")).concat(
      Array.from(document.getElementsByTagName("audio"))
    );
    for (let el of els) {
      if (el.srcObject && el.srcObject.getTracks()[0] === evt.track) {
        el.remove();
      }
    }
  }

  logEvent(evt) {
    console.log("DAILY EVENT!");
    console.log(evt);
    console.log("-----------");
  }
}
