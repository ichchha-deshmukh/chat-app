(function ChatApp() {
  let username;

  // Helper functions
  function getElementById(elementId) {
    return document.getElementById(elementId);
  }

  function getFromDatabase(key) {
    return window.localStorage.getItem(`${username}_${key}`);
  }

  function saveInDatabase(key, value) {
    window.localStorage.setItem(`${username}_${key}`, value);
  }

  function formatTime(timestamp) {
    const formatter = new Intl.DateTimeFormat("en-us", {
      hour: "numeric",
      minute: "numeric",
      hour12: getFromDatabase(`clockFormat`) !== "24hr",
    });

    return formatter.format(timestamp);
  }

  function isValidImageUrl(url) {
    return url.match(/^http.*\.(jpeg|jpg|gif|png|webp)$/) != null;
  }

  //Initialize client socket io
  const socket = io();

  const buttonSettings = getElementById("settings-btn");
  const modalSettings = getElementById("modal");
  const formSettings = getElementById("settings-form");
  const buttonCloseModal = getElementById("close-btn");
  const inputUserName = getElementById("username");
  const radioClock12Hr = getElementById("radio-12hr");
  const radioClock24Hr = getElementById("radio-24hr");
  const radioCtrlEnterOn = getElementById("radio-On");
  const radioCtrlEnterOff = getElementById("radio-Off");
  const buttonResetSettingsForm = getElementById("reset-btn");
  const chatSection = getElementById("chat-section");
  const textareaMessage = getElementById("text-area");
  const buttonSendMessage = getElementById("send-btn");

  function resetSettingsForm(event) {
    event.preventDefault();
    const defaultUsername = getFromDatabase(`defaultUsername`);
    inputUserName.value = defaultUsername;
    radioClock12Hr.checked = true;
    radioCtrlEnterOn.checked = true;
  }

  function showSettingsModal() {
    modalSettings.style.display = "flex";
    inputUserName.value = getFromDatabase(`username`);
  }

  function hideSettingsModal() {
    modalSettings.style.display = "none";
  }

  function saveSettings(event) {
    event.preventDefault();
    const newUserName = inputUserName.value.trim();
    if (!newUserName) {
      alert("Username should not be blank!");
      inputUserName.focus();
      return;
    }
    saveInDatabase(`username`, newUserName);
    saveInDatabase(`clockFormat`, radioClock12Hr.checked ? "12hr" : "24hr");
    saveInDatabase(`enterToSend`, radioCtrlEnterOn.checked ? "On" : "Off");

    hideSettingsModal();
  }

  function scrollToBottom() {
    chatSection.scrollTop = chatSection.scrollHeight;
  }

  function sendMessage() {
    const message = textareaMessage.value.trim();
    if (message !== "") {
      const user = getFromDatabase(`username`);
      let msg = {
        user,
        message,
        sentTime: Date.now(),
      };

      appendMessage(msg, "outgoing");
      textareaMessage.value = "";
      scrollToBottom();

      // Send to server
      socket.emit("message", msg);
    }
  }

  function handleTextareaMessageKeyup(event) {
    if (
      getFromDatabase(`enterToSend`) !== "Off" &&
      event.code === "Enter" &&
      event.ctrlKey
    ) {
      sendMessage();
    }
  }

  function appendMessage(messageInfo, type) {
    const chatMessage = document.createElement("div");
    chatMessage.classList.add(type, "chat__message");

    const h5 = document.createElement("h5");
    h5.classList.add(type, "chat__message-author");

    const author = document.createElement("span");
    author.innerText = `${messageInfo.user} `;
    const time = document.createElement("time");
    time.innerText = formatTime(messageInfo.sentTime);
    h5.appendChild(author);
    h5.appendChild(time);

    const p = document.createElement("p");
    p.classList.add(type, "chat__message-text");

    const messageGroups = messageInfo.message
      .replace(/\n/g, " ")
      .split(" ")
      .reduce((acc, current) => {
        if (isValidImageUrl(current)) {
          const img = document.createElement("img");
          img.classList.add(type, "chat__message-image");
          img.src = current;
          acc.push(img);
        } else if (typeof acc[acc.length - 1] === "string") {
          acc[acc.length - 1] += ` ${current}`;
        } else {
          acc.push(current);
        }

        return acc;
      }, []);

    messageGroups.forEach((group) => {
      if (typeof group === "string") {
        const span = document.createElement("span");
        span.innerText = group;
        p.appendChild(span);
      } else {
        p.appendChild(group);
      }
    });

    chatMessage.appendChild(h5);
    chatMessage.appendChild(p);
    chatSection.appendChild(chatMessage);
  }

  formSettings.addEventListener("submit", saveSettings);
  textareaMessage.addEventListener("keyup", handleTextareaMessageKeyup);
  buttonSendMessage.addEventListener("click", sendMessage);
  buttonResetSettingsForm.addEventListener("click", resetSettingsForm);
  buttonSettings.addEventListener("click", showSettingsModal);
  buttonCloseModal.addEventListener("click", hideSettingsModal);

  //Recieve messages
  socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
    scrollToBottom();
  });

  let savedName = getFromDatabase(`username`);
  if (!savedName) {
    do username = prompt("Please enter username: ");
    while (!username);
    saveInDatabase(`defaultUsername`, username);
    saveInDatabase(`username`, username);
  } else {
    username = savedName;
  }

  //Check Radio Button
  let savedClockFormatSetting = getFromDatabase(`clockFormat`);
  if (savedClockFormatSetting === "24hr") {
    radioClock24Hr.checked = true;
  }

  //Check Enter Key
  let savedEnterToSendSetting = getFromDatabase(`enterToSend`);
  if (savedEnterToSendSetting === "Off") {
    radioCtrlEnterOff.checked = true;
  }
})();
