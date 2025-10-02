// Check admin auth
auth.onAuthStateChanged(async user=>{
  if(!user) window.location.href="login.html";
  const uid = user.uid;
  const doc = await db.collection("users").doc(uid).get();
  if(doc.exists && doc.data().role!=="admin") window.location.href="user.html";

  loadUsers();
  loadSensorData();
});

// Load all users
async function loadUsers(){
  const snapshot = await db.collection("users").get();
  const div = document.getElementById("usersList");
  div.innerHTML = "";
  snapshot.forEach(doc=>{
    div.innerHTML += `<div>${doc.data().email} (${doc.data().role})</div>`;
  });
}

// Send command to ESP32
async function sendCommand(cmd){
  const device = document.getElementById("deviceSelect").value;
  if(!device) return alert("Select device");
  await db.collection("commands").add({
    device: device,
    command: cmd,
    issuedBy: "admin",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Command sent: "+cmd);
}

// Load sensor data
async function loadSensorData(){
  db.collection("sensorData").orderBy("timestamp","desc").limit(50)
    .onSnapshot(snapshot=>{
      const table = document.getElementById("sensorTable");
      table.innerHTML = "<tr><th>Device</th><th>Water Level</th><th>Flow Rate</th><th>Status</th><th>Time</th></tr>";
      snapshot.forEach(doc=>{
        const d = doc.data();
        table.innerHTML += `<tr>
          <td>${d.device}</td>
          <td>${d.waterLevel}</td>
          <td>${d.flowRate}</td>
          <td>${d.status}</td>
          <td>${new Date(d.timestamp?.seconds*1000).toLocaleString()}</td>
        </tr>`;
      });
    });
}
