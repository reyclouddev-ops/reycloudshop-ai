const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

const modal = document.getElementById("settingsModal");
const openSetting = document.getElementById("settingsOpen");
const closeSetting = document.getElementById("closeSettings");

const saveBtn = document.getElementById("saveSetting");
const resetBtn = document.getElementById("resetPrompt");

const systemPrompt = document.getElementById("systemPrompt");
const model = document.getElementById("model");

const historyList = document.getElementById("historyList");

let history =
JSON.parse(localStorage.getItem("chatHistory")) || [];

/* =========================
   Default Prompt
========================= */

const defaultPrompt = `Kamu adalah ReyCloudShop AI.

Selalu gunakan Bahasa Indonesia.

Jawab singkat, jelas, dan mudah dipahami.

Fokus membantu:
- WhatsApp Bot
- Node.js
- JavaScript
- Website
- API
- Roblox
- Debug Error`;

systemPrompt.value =
localStorage.getItem("prompt") || defaultPrompt;

model.value =
localStorage.getItem("model") || "gpt-5";

/* =========================
   Settings
========================= */

openSetting.onclick = () =>{
modal.classList.add("show");
}

closeSetting.onclick = () =>{
modal.classList.remove("show");
}

window.onclick = e=>{
if(e.target===modal){
modal.classList.remove("show");
}
}

saveBtn.onclick = ()=>{

localStorage.setItem(
"prompt",
systemPrompt.value
);

localStorage.setItem(
"model",
model.value
);

alert("Settings berhasil disimpan.");

modal.classList.remove("show");

}

resetBtn.onclick=()=>{

systemPrompt.value=defaultPrompt;

}

/* =========================
   Bubble Chat
========================= */

function addMessage(text,type){

const bubble=document.createElement("div");

bubble.className=
type==="user"
?
"message user"
:
"message bot";

bubble.innerText=text;

chatBox.appendChild(bubble);

chatBox.scrollTop=
chatBox.scrollHeight;

}

/* =========================
Typing
========================= */

function typing(){

const div=document.createElement("div");

div.className="message bot";

div.id="typing";

div.innerHTML=
"🤖 ReyCloudShop Ai sedang mengetik...";

chatBox.appendChild(div);

chatBox.scrollTop=
chatBox.scrollHeight;

}

function removeTyping(){

const t=document.getElementById("typing");

if(t)t.remove();

}

/* =========================
History
========================= */

function saveHistory(text){

history.push(text);

localStorage.setItem(
"chatHistory",
JSON.stringify(history)
);

renderHistory();

}

function renderHistory(){

historyList.innerHTML="";

history.forEach((item,index)=>{

const div=document.createElement("div");

div.className="history-item";

div.innerText=item;

div.onclick=()=>{

messageInput.value=item;

}

historyList.appendChild(div);

});

}

renderHistory();

/* =========================
Send Message
========================= */

async function sendMessage(){

const text=
messageInput.value.trim();

if(!text)return;

addMessage(text,"user");

saveHistory(text);

messageInput.value="";

typing();

try{

const res=
await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

text,

prompt:
systemPrompt.value,

model:
model.value

})

});

const data=
await res.json();

removeTyping();

addMessage(
data.result ||
"AI tidak merespons.",
"bot"
);

}catch(err){

removeTyping();

addMessage(
"Gagal terhubung ke server.",
"bot"
);

console.error(err);

}

}

/* =========================
Button
========================= */

sendBtn.onclick=sendMessage;

messageInput.addEventListener(
"keydown",
e=>{

if(
e.key==="Enter"
&&
!e.shiftKey
){

e.preventDefault();

sendMessage();

}

}
);

/* =========================
Auto Resize
========================= */

messageInput.addEventListener(
"input",
()=>{

messageInput.style.height="auto";

messageInput.style.height=
messageInput.scrollHeight+"px";

}
);

/* =========================
New Chat
========================= */

document
.getElementById("newChat")
.onclick=()=>{

if(confirm("Hapus percakapan?")){

chatBox.innerHTML=`
<div class="welcome">
🤖
<h1>Selamat Datang</h1>
<p>Silakan mulai percakapan baru.</p>
</div>`;

}

}
