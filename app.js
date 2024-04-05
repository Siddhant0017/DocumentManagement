// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        document.getElementById('message').textContent = `Logged in as ${user.email}`;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('documentManagement').style.display = 'block';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('message').textContent = errorMessage;
    });
}

// Logout function
function logout() {
    firebase.auth().signOut().then(() => {
        document.getElementById('message').textContent = 'Logged out successfully';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('documentManagement').style.display = 'none';
    }).catch((error) => {
        document.getElementById('message').textContent = error.message;
    });
}

// Function to upload a document
function uploadDocument() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Generate a unique ID for the document
    const documentId = Date.now().toString();

    // Upload file to Firebase Storage
    const storageRef = firebase.storage().ref(`documents/${documentId}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (error) => {
            // Handle unsuccessful upload
            console.error(error);
        },
        () => {
            // Handle successful upload
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Save document metadata (e.g., downloadURL, filename) to Firestore
                firebase.firestore().collection('documents').doc(documentId).set({
                    fileName: file.name,
                    downloadURL: downloadURL,
                    uploadedBy: firebase.auth().currentUser.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    console.log('Document metadata successfully saved to Firestore');
                    document.getElementById('message').textContent = 'Document uploaded successfully';
                })
                .catch((error) => {
                    console.error('Error saving document metadata:', error);
                    document.getElementById('message').textContent = 'Error uploading document';
                });
            });
        }
    );
}

// Function to update or delete a document
function updateDeleteDocument(documentId) {
    // Placeholder for document update/delete functionality
    const confirmation = confirm("Do you want to update or delete this document?");
    if (confirmation) {
        // For simplicity, assume the user confirms the action
        // Here you can implement logic to update or delete the document from Firestore
        // You might show a form to update the document or directly delete it
        console.log(`Document with ID ${documentId} will be updated or deleted`);
        document.getElementById('message').textContent = 'Document update/delete functionality to be implemented';
    } else {
        console.log("Update/delete action canceled");
    }
}

// Function to share a document
function shareDocument(documentId) {
    // Placeholder for document sharing functionality
    const email = prompt("Enter email of the person you want to share this document with:");
    if (email) {
        // For simplicity, assume the email is provided
        // Here you can implement logic to share the document with the provided email address
        console.log(`Document with ID ${documentId} will be shared with ${email}`);
        document.getElementById('message').textContent = 'Document sharing functionality to be implemented';
    } else {
        console.log("No email provided for sharing");
    }
}

// Function to view user profile
function viewProfile() {
    const user = firebase.auth().currentUser;
    if (user) {
        // User is signed in
        const userProfile = {
            name: user.displayName,
            email: user.email,
            uid: user.uid
            // Add more profile information as needed
        };
        console.log("User Profile:", userProfile);
        document.getElementById('message').textContent = `Name: ${userProfile.name}, Email: ${userProfile.email}, UID: ${userProfile.uid}`;
    } else {
        // No user signed in
        console.log("No user signed in");
        document.getElementById('message').textContent = "No user signed in";
    }
}
