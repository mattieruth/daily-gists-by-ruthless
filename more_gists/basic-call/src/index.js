import "./style.css";
import DailyCall from "./call.js";

function _localControls() {
  let lcDiv = document.createElement("div");
  lcDiv.id = "local-controls";

  let joinBtn = document.createElement("button");
  joinBtn.onclick = () => {
    call.join();
  };
  joinBtn.innerHTML = "join";
  lcDiv.appendChild(joinBtn);

  let leaveBtn = document.createElement("button");
  leaveBtn.onclick = () => {
    call.leave();
  };
  leaveBtn.innerHTML = "leave";
  lcDiv.appendChild(leaveBtn);

  return lcDiv;
}

function _videoSection() {
  let vidDiv = document.createElement("div");
  vidDiv.classList.add("flex-container");
  vidDiv.id = "vidSection";

  let title = document.createElement("h2");
  title.innerHTML = "videos";
  vidDiv.appendChild(title);

  let vids = document.createElement("div");
  vids.id = "videos";
  vidDiv.appendChild(vids);

  return vidDiv;
}

window.call = new DailyCall();
document.body.appendChild(_localControls());
document.body.appendChild(_videoSection());
