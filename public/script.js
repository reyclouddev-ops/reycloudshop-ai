/* ===========================
   ReyCloudShop AI
   Part 1
=========================== */

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

/* ===========================
   Local Storage
=========================== */

let history =
JSON.parse(
localStorage.getItem("chatHistory")
) || [];

const defaultPrompt = `Kamu adalah ReyCloudShop AI.

Selalu gunakan Bahasa Indonesia.

Jawab singkat, jelas, dan mudah dipahami.

Fokus membantu:
- HTML
- CSS
- JavaScript
- Node.js
- WhatsApp Bot
- API
- Roblox
- Website
- Debug Error`;

systemPrompt.value =
localStorage.getItem("prompt") || defaultPrompt;

model.value =
localStorage.getItem("model") || "gpt-5";

/* ===========================
   Settings
=========================== */

openSetting.onclick = () => {

modal.classList.add("show");

};

closeSetting.onclick = () => {

modal.classList.remove("show");

};

window.onclick = e => {

if(e.target===modal){

modal.classList.remove("show");

}

};

saveBtn.onclick = ()=>{

localStorage.setItem(
"prompt",
systemPrompt.value
);

localStorage.setItem(
"model",
model.value
);

modal.classList.remove("show");

alert("Pengaturan berhasil disimpan.");

};

resetBtn.onclick = ()=>{

systemPrompt.value = defaultPrompt;

};

/* ===========================
   Bubble Chat Modern
=========================== */

function addMessage(text,type){

const message=document.createElement("div");

message.className=`message ${type}`;

const bubble=document.createElement("div");

bubble.className="bubble";

if(type==="user"){

bubble.textContent=text;

}else{

bubble.innerHTML=`
<div class="ai-header">

<div class="ai-left">

<div class="ai-avatar">
🤖
</div>

<div>

<b>ReyCloudShop AI</b>

</div>

</div>

<button class="copy-btn">

📋 Copy

</button>

</div>

<div class="ai-content"></div>
`;

const content=
bubble.querySelector(".ai-content");

content.innerHTML=
marked.parse(text);

bubble
.querySelector(".copy-btn")
.onclick=()=>{

navigator.clipboard.writeText(text);

const btn=
bubble.querySelector(".copy-btn");

btn.innerHTML="✅";

setTimeout(()=>{

btn.innerHTML="📋 Copy";

},1200);

};

bubble
.querySelectorAll("pre code")
.forEach(block=>{

hljs.highlightElement(block);

});

}

message.appendChild(bubble);

chatBox.appendChild(message);

chatBox.scrollTop=
chatBox.scrollHeight;

}

/* ===========================
   Typing
=========================== */

function typing(){

const typing=document.createElement("div");

typing.className="message ai";

typing.id="typing";

typing.innerHTML=`

<div class="bubble">

<div class="typing-box">

<div class="dot"></div>

<div class="dot"></div>

<div class="dot"></div>

</div>

</div>

`;

chatBox.appendChild(typing);

chatBox.scrollTop=
chatBox.scrollHeight;

}

function removeTyping(){

const t=document.getElementById("typing");

if(t)t.remove();

}

/* ===========================
   History
=========================== */

function saveHistory(text){

if(history.includes(text)) return;

history.unshift(text);

history=history.slice(0,20);

localStorage.setItem(
"chatHistory",
JSON.stringify(history)
);

renderHistory();

}

function renderHistory(){

historyList.innerHTML="";

history.forEach(item=>{

const div=document.createElement("div");

div.className="history-item";

div.textContent=item;

div.onclick=()=>{

messageInput.value=item;

messageInput.focus();

};

historyList.appendChild(div);

});

}

renderHistory();
/* ===========================
   Send Message
=========================== */

async function sendMessage(){

const text = messageInput.value.trim();

if(!text) return;

addMessage(text,"user");

saveHistory(text);

messageInput.value="";

messageInput.style.height="55px";

typing();

try{

const res = await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

text,

prompt:systemPrompt.value,

model:model.value

})

});

const data = await res.json();

removeTyping();

if(!data.success){

addMessage(
data.error ||
data.message ||
"Terjadi kesalahan.",
"ai"
);

return;

}

addMessage(
data.result,
"ai"
);

}catch(err){

removeTyping();

addMessage(
"❌ Gagal terhubung ke server.",
"ai"
);

console.error(err);

}

}

/* ===========================
   Auto Scroll
=========================== */

function scrollBottom(){

chatBox.scrollTo({

top:chatBox.scrollHeight,

behavior:"smooth"

});

}

/* ===========================
   Input
=========================== */

sendBtn.onclick = ()=>{

sendMessage();

};

messageInput.addEventListener(
"keydown",
e=>{

if(
e.key==="Enter" &&
!e.shiftKey
){

e.preventDefault();

sendMessage();

}

}
);

/* ===========================
   Auto Resize Textarea
=========================== */

messageInput.addEventListener(
"input",
()=>{

messageInput.style.height="55px";

messageInput.style.height=
messageInput.scrollHeight+"px";

}
);

/* ===========================
   New Chat
=========================== */

document
.getElementById("newChat")
.onclick=()=>{

if(!confirm("Mulai percakapan baru?"))
return;

chatBox.innerHTML=`

<div class="welcome">

<div class="welcome-icon">
🤖
</div>

<h1>Selamat Datang</h1>

<p>

Silakan tanyakan apa saja.

Saya siap membantu coding,
Website,
Node.js,
WhatsApp Bot,
API,
Roblox,
dan lainnya.

</p>

</div>

`;

scrollBottom();

};

/* ===========================
   Welcome Scroll
=========================== */

scrollBottom();
/* ===========================
   ChatGPT Effect
=========================== */

async function typeMessage(text){

const message=document.createElement("div");

message.className="message ai";

const bubble=document.createElement("div");

bubble.className="bubble";

bubble.innerHTML=`

<div class="ai-header">

<div class="ai-left">

<div class="ai-avatar">
🤖
</div>

<div>

<b>ReyCloudShop AI</b>

</div>

</div>

<button class="copy-btn">
📋 Copy
</button>

</div>

<div class="ai-content typing-text"></div>

`;

message.appendChild(bubble);

chatBox.appendChild(message);

scrollBottom();

const content=
bubble.querySelector(".typing-text");

let output="";

for(let i=0;i<text.length;i++){

output+=text[i];

content.textContent=output;

scrollBottom();

await new Promise(resolve=>{

setTimeout(resolve,8);

});

}

content.innerHTML=
marked.parse(text);

bubble
.querySelectorAll("pre code")
.forEach(block=>{

hljs.highlightElement(block);

});

bubble
.querySelector(".copy-btn")
.onclick=()=>{

navigator.clipboard.writeText(text);

const btn=
bubble.querySelector(".copy-btn");

btn.innerHTML="✅ Copied";

setTimeout(()=>{

btn.innerHTML="📋 Copy";

},1500);

};

}

/* ===========================
   Ganti addMessage AI
=========================== */

const oldAddMessage=addMessage;

addMessage=(text,type)=>{

if(type==="ai"){

typeMessage(text);

return;

}

oldAddMessage(text,type);

};

/* ===========================
   Loading Dot
=========================== */

const style=document.createElement("style");

style.innerHTML=`

.typing-box{

display:flex;

gap:8px;

padding:18px;

}

.dot{

width:10px;

height:10px;

border-radius:50%;

background:#60a5fa;

animation:typing 1s infinite;

}

.dot:nth-child(2){

animation-delay:.2s;

}

.dot:nth-child(3){

animation-delay:.4s;

}

@keyframes typing{

0%{

transform:translateY(0);

opacity:.3;

}

50%{

transform:translateY(-6px);

opacity:1;

}

100%{

transform:translateY(0);

opacity:.3;

}

}

.typing-text{

white-space:pre-wrap;

word-break:break-word;

}

.copy-btn{

transition:.2s;

}

.copy-btn:hover{

transform:scale(1.05);

}

`;

document.head.appendChild(style);
