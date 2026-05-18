let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// عرض تاريخ اليوم في الهيدر
document.getElementById("currentDate").innerText = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("title").value;
  const subject = document.getElementById("subject").value;
  const deadline = document.getElementById("deadline").value;

  if (!title || !subject || !deadline) {
    alert("برجاء إدخال كافة البيانات!");
    return;
  }

  const daysLeft = getDaysLeft(deadline);

  const task = {
    id: Date.now(),
    title,
    subject,
    deadline,
    done: false
  };

  tasks.push(task);
  saveTasks();
  displayTasks();

  // مسح الخانات
  document.getElementById("title").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("deadline").value = "";
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  displayTasks();
}

function toggleDone(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  displayTasks();
}

function getDaysLeft(deadlineDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadlineDate);
  const diff = due - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function displayTasks() {
  const container = document.getElementById("tasks");
  container.innerHTML = "";

  // ترتيب المهام: الأقرب موعداً أولاً
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  tasks.forEach(task => {
    const daysLeft = getDaysLeft(task.deadline);
    const card = document.createElement("div");
    
    // منطق الألوان بناءً على الديدلاين
    let urgency = "green";
    if (daysLeft <= 2) urgency = "red";
    else if (daysLeft <= 7) urgency = "orange";

    card.className = `card ${urgency} ${task.done ? 'completed' : ''}`;

    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>📚 المادة: ${task.subject}</p>
      <p>📅 الموعد: ${task.deadline}</p>
      <span class="days-badge">
        ${daysLeft < 0 ? `⚠️ متأخر بـ ${Math.abs(daysLeft)} يوم` : 
          daysLeft === 0 ? "🔔 التسليم اليوم!" : 
          `⏳ متبقي ${daysLeft} يوم`}
      </span>
      <div class="card-btns">
        <button class="done-btn" onclick="toggleDone(${task.id})">${task.done ? "تراجع" : "تم"}</button>
        <button class="del-btn" onclick="deleteTask(${task.id})">حذف</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.onload = displayTasks;