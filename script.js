const API_URL = "http://localhost:3000/api";

// Load Dashboard Statistics
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL}/dashboard`);
    const data = await res.json();
    document.getElementById("todayAppointments").textContent = data.todayAppointments;
    document.getElementById("pendingReports").textContent = data.pendingReports;
    document.getElementById("newPatients").textContent = data.newPatients;
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

// Load Patients Table
async function loadPatients() {
  try {
    const res = await fetch(`${API_URL}/patients`);
    const patients = await res.json();
    const tbody = document.getElementById("patientTableBody");

    if (patients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No patients found</td></tr>';
      return;
    }

    tbody.innerHTML = patients.map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.treatment}</td>
        <td>${p.status}</td>
        <td>
          <button class="action-btn edit-btn" onclick="openEditModal('${p._id}', '${p.name}', ${p.age}, '${p.treatment}', '${p.status}')">Edit</button>
          <button class="action-btn delete-btn" onclick="deletePatient('${p._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Error loading patients:", error);
  }
}

// Add New Appointment
document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("patientName").value,
    age: parseInt(document.getElementById("patientAge").value),
    date: document.getElementById("appointmentDate").value,
    treatment: document.getElementById("treatment").value,
    status: document.getElementById("status").value
  };

  try {
    const response = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Appointment Added Successfully!");
      e.target.reset();
      loadDashboard();
      loadPatients();
    } else {
      alert("Failed to add appointment");
    }
  } catch (error) {
    console.error("Error adding appointment:", error);
    alert("Error adding appointment");
  }
});

// Open Edit Modal
function openEditModal(id, name, age, treatment, status) {
  document.getElementById("editPatientId").value = id;
  document.getElementById("editPatientName").value = name;
  document.getElementById("editPatientAge").value = age;
  document.getElementById("editTreatment").value = treatment;
  document.getElementById("editStatus").value = status;
  document.getElementById("editModal").style.display = "block";
}

// Close Edit Modal
document.querySelector(".close").onclick = function() {
  document.getElementById("editModal").style.display = "none";
};

window.onclick = function(event) {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Update Patient
document.getElementById("editPatientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editPatientId").value;
  const data = {
    name: document.getElementById("editPatientName").value,
    age: parseInt(document.getElementById("editPatientAge").value),
    treatment: document.getElementById("editTreatment").value,
    status: document.getElementById("editStatus").value
  };

  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Patient Updated Successfully!");
      document.getElementById("editModal").style.display = "none";
      loadPatients();
      loadDashboard();
    } else {
      alert("Failed to update patient");
    }
  } catch (error) {
    console.error("Error updating patient:", error);
    alert("Error updating patient");
  }
});

// Delete Patient
async function deletePatient(id) {
  if (!confirm("Are you sure you want to delete this patient?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Patient Deleted Successfully!");
      loadPatients();
      loadDashboard();
    } else {
      alert("Failed to delete patient");
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    alert("Error deleting patient");
  }
}

// Chatbot Functionality
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chat-box");

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  chatBox.innerHTML += `<div class="user-msg">${msg}</div>`;
  userInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, sender: "user" })
    });

    setTimeout(async () => {
      const reply = getBotResponse(msg);
      chatBox.innerHTML += `<div class="bot-msg">${reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;

      await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply, sender: "bot" })
      });
    }, 1000);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

function getBotResponse(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("appointment")) return "You can schedule appointments in the Appointments section.";
  if (msg.includes("patient")) return "Patient records are available in the Patients section.";
  if (msg.includes("treatment")) return "We offer Abhyanga, Shirodhara, Virechana, and Nasya treatments.";
  if (msg.includes("edit")) return "To edit patient details, click the Edit button next to the patient in the Patients section.";
  if (msg.includes("delete")) return "To delete a patient record, click the Delete button next to the patient in the Patients section.";
  if (msg.includes("help")) return "I can help you with appointments, patient records, treatments, and navigation.";
  return "How can I help you with AyurSutra services?";
}

document.getElementById("sendBtn").onclick = sendMessage;
userInput.onkeypress = (e) => { 
  if (e.key === "Enter") sendMessage(); 
};

// Initialize on page load
loadDashboard();
loadPatients();