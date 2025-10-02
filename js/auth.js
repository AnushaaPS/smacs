// Signup (for testing, or admin creates users)
async function signup(email, password, role="user") {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Add user to Firestore
    await db.collection("users").doc(uid).set({
      role: role,
      email: email
    });
    alert("User created: "+role);
  } catch(e) { console.error(e); alert(e.message); }
}

// Login
async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) throw "User profile not found";

    const role = userDoc.data().role;
    localStorage.setItem("uid", uid);
    localStorage.setItem("role", role);

    if (role==="admin") window.location.href="admin.html";
    else window.location.href="user.html";
  } catch(e) { console.error(e); alert(e.message); }
}

// Logout
function logout() {
  auth.signOut();
  localStorage.clear();
  window.location.href="login.html";
}

// Redirect if already logged in
auth.onAuthStateChanged(user => {
  if(user){
    const role = localStorage.getItem("role");
    if(role==="admin") window.location.href="admin.html";
    else if(role==="user") window.location.href="user.html";
  }
});
