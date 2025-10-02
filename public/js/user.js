auth.onAuthStateChanged(async user=>{
  if(!user) window.location.href="login.html";
  const uid = user.uid;
  const doc = await db.collection("users").doc(uid).get();
  if(doc.exists && doc.data().role!=="user") window.location.href="admin.html";

  const device = uid; // assume device id = uid
  loadSensorData(device);
});

// Request water (adds command)
async function requestWater(){
  const liters = parseFloat(document.getElementById("liters").value);
  if(!liters || liters<=0) return alert("Enter liters");

  const uid = auth.currentUser.uid;
  await db.collection("commands").add({
    device: uid,
    command: "ON",
    issuedBy: "user",
    liters: liters,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Water request sent");
}

// Load sensor data
function loadSensorData(device){
  db.collection("sensorData").where("device","==",device).orderBy("timestamp","desc").limit(50)
    .onSnapshot(snapshot=>{
      const table = document.getElementById("sensorTable");
      table.innerHTML = "<tr><th>Water Level</th><th>Flow Rate</th><th>Status</th><th>Time</th></tr>";
      snapshot.forEach(doc=>{
        const d = doc.data();
        table.innerHTML += `<tr>
          <td>${d.waterLevel}</td>
          <td>${d.flowRate}</td>
          <td>${d.status}</td>
          <td>${new Date(d.timestamp?.seconds*1000).toLocaleString()}</td>
        </tr>`;
      });
    });
}
