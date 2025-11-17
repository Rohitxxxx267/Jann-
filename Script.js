let peer, localStream;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    document.getElementById('myVideo').srcObject = stream;
  })
  .catch(err => alert('Camera/Mic access chahiye: ' + err));

document.getElementById('createBtn').onclick = () => {
  const callId = 'call-' + Math.floor(Math.random() * 10000);
  const pin = Math.floor(1000 + Math.random() * 9000);
  alert('Share karo ye Call ID: ' + callId + '\nPIN: ' + pin);

  peer = new Peer(callId, { debug: 2 });

  peer.on('open', id => console.log('Call ID:', id));
  peer.on('call', call => {
    const enteredPin = prompt('Enter your PIN:');
    if (enteredPin == pin) {
      call.answer(localStream);
      call.on('stream', remoteStream => {
        document.getElementById('peerVideo').srcObject = remoteStream;
      });
    } else {
      alert('GALAT PIN!');
    }
  });
};

document.getElementById('joinBtn').onclick = () => {
  const callId = document.getElementById('joinId').value;
  const pin = document.getElementById('pin').value;
  if (!callId || !pin) {
    return alert('Call ID aur PIN dono bharo');
  }

  peer = new Peer({ debug: 2 });

  peer.on('open', id => {
    const call = peer.call(callId, localStream);
    call.on('stream', remoteStream => {
      document.getElementById('peerVideo').srcObject = remoteStream;
    });
  });
};
