window.onload = function() {
  const defaultLiffId = "1653603515-dM2LVvkZ"; // change the default LIFF value if you are not using a node server

  let myLiffId = "1653603515-dM2LVvkZ";

  myLiffId = defaultLiffId;
  initializeLiffOrDie(myLiffId);

};

function setMessageByElement(element, message){
  return document.getElementById(element).innerHTML = message;
}

function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    setMessageByElement('app', 'Service is unavailable. Please check your LIFF ID.');
  } else {
    initializeLiff(myLiffId);
    console.log('OK!');
  }
}

function initializeLiff(myLiffId) {

    liff.init({
      liffId: myLiffId
    })
    .then(() => {
      initializeApp();
    })
    .catch((e) => {
      console.log(e);
    });
}

function initializeApp() {

  /*if (!liff.isInClient()) {
    setMessageByElement('app', 'Please use LINE app instead.');
    return false;//console.lgo(liff.isInClient());
  }*/

  liff.getProfile().then(function(profile) {

      setMessageByElement('userName', profile.displayName);
      document.getElementById('userImg').src = profile.pictureUrl;
      document.getElementById('userImg').alt = profile.pictureUrl;

  }).catch(function(e) {
    console.log(e);
  });

  const accessToken = liff.getAccessToken();
  setMessageByElement('accessToken', accessToken);

}
