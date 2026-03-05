import { db } from "./firebase.js";
import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const ADMIN_PASSWORD = "bayyyymasihgamonanjay";
const isAdmin = new URLSearchParams(window.location.search).get("admin") === ADMIN_PASSWORD;

const commentsRef = collection(db,"comments");

async function render(){
    const container = document.getElementById("comments");
    container.innerHTML = "";

    const snapshot = await getDocs(commentsRef);

    snapshot.forEach((docSnap)=>{
        const c = docSnap.data();
        const id = docSnap.id;

        let div = document.createElement("div");
        div.className="comment";

        let html = `<strong>anonim</strong><br>${c.text}<br><br>`;

        if(isAdmin){
            html+=`
            <button onclick="toggleReplyForm('${id}')">balas</button>
            <button onclick="deleteComment('${id}')">hapus</button>
            `;
        }

        div.innerHTML=html;

        // tampilkan replies
        c.replies.forEach(r=>{
            let rep=document.createElement("div");
            rep.className="reply";

            if(r.from==="fall"){
                rep.innerHTML="<strong>Fall.</strong><br>"+r.text;
            }else{
                rep.innerHTML="<strong>anonim</strong><br>"+r.text;
            }

            div.appendChild(rep);
        });

        // form reply admin
        if(isAdmin){
            let form=document.createElement("div");
            form.className="reply-form";
            form.id="reply-form-"+id;
            div.appendChild(form);
        }

        // form reply anonim (hanya jika fall sudah balas)
        if(!isAdmin && c.replies.some(r=>r.from==="fall")){
            let form=document.createElement("div");
            form.className="reply-form";

            form.innerHTML=`
            <textarea id="anon-reply-${id}" placeholder="balas..."></textarea>
            <button onclick="anonReply('${id}')">kirim</button>
            `;

            div.appendChild(form);
        }

        container.appendChild(div);
    });
}

async function addComment(){
    const text=document.getElementById("message").value;
    if(text.trim()=="") return;

    await addDoc(commentsRef,{
        text:text,
        replies:[]
    });

    document.getElementById("message").value="";
    render();
}

window.addComment=addComment;

async function deleteComment(id){
    await deleteDoc(doc(db,"comments",id));
    render();
}

window.deleteComment=deleteComment;

function toggleReplyForm(id){
    const form=document.getElementById("reply-form-"+id);

    if(form.innerHTML!==""){
        form.innerHTML="";
        return;
    }

    form.innerHTML=`
    <textarea id="reply-${id}" placeholder="balas sebagai Fall..."></textarea>
    <button onclick="submitReply('${id}')">kirim</button>
    `;
}

window.toggleReplyForm=toggleReplyForm;

async function submitReply(id){
    const input=document.getElementById("reply-"+id);
    const text=input.value.trim();
    if(text==="") return;

    const snap=await getDocs(commentsRef);

    snap.forEach(async(d)=>{
        if(d.id===id){

            let data=d.data();

            data.replies.push({
                from:"fall",
                text:text
            });

            await updateDoc(doc(db,"comments",id),{
                replies:data.replies
            });

        }
    });

    render();
}

window.submitReply=submitReply;

async function anonReply(id){

const input=document.getElementById("anon-reply-"+id);
const text=input.value.trim();

if(text==="") return;

const snap=await getDocs(commentsRef);

snap.forEach(async(d)=>{
if(d.id===id){

let data=d.data();

data.replies.push({
from:"anon",
text:text
});

await updateDoc(doc(db,"comments",id),{
replies:data.replies
});

}
});

render();
}

window.anonReply=anonReply;

render();