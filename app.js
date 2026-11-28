
// ===== SETTINGS: change these =====
const WHATSAPP = "256709714959"; // pharmacy WhatsApp number, no + or spaces
// ===== BRANCH DETAILS: edit the text inside the quotes =====
const BRANCHES = [
  { name: "Olya Road",   address: "Plot 26, Olya Road, Pece-Laroo, Gulu City East",   phones: ["0393001498"], hours: "Mon–Sat 8:00–20:00", map: "https://www.google.com/maps/dir/?api=1&destination=2.770177,32.301311" },
  { name: "Acholi Road", address: "Plot 5, Acholi Road, Bus Park, Gulu", phones: ["0393003737"],               hours: "Mon–Sat 8:00–20:00", map: "https://www.google.com/maps/dir/?api=1&destination=2.7695191,32.2992171" }
]; // hours: leave "" to hide it.
// DIRECTIONS: paste the Google Maps link for each branch into map. The Get directions button opens it.
const EMAIL = "";
// ===== SOCIAL LINKS: paste the full page link between the quotes (leave "" to hide) =====
const SOCIALS = {
  instagram: "https://www.instagram.com/believe_pharmacy/",
  facebook:  "https://www.facebook.com/p/Believe-Pharmacy-61576803967532/",
  tiktok:    "https://www.tiktok.com/@believe.pharmacy1"
}; // e.g. "hello@believepharmacy.ug" (leave "" to hide)
// ===== SUPABASE (accounts, products, orders, prescriptions): paste your project values =====
const SUPABASE_URL = "https://xlrwvbitiohlgsiizrrh.supabase.co";       // e.g. "https://abcdxyz.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscnd2Yml0aW9obGdzaWl6cnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyMzc1OTQsImV4cCI6MjExMDgxMzU5NH0.ouCWdL5qJ0YYvL3VWugscK-Ov1GxXiLn_uN7EC1Ds-w";  // the "anon public" key (never the service_role key)
// ==================================
let P=[
 ["Body Lotion 400ml","Cosmetics",12000,"🧴"],["Shea Butter Moisturiser 200g","Cosmetics",15000,"🌰"],
 ["Sunscreen SPF 50 (100ml)","Cosmetics",35000,"☀️"],["Gentle Face Wash 150ml","Cosmetics",14000,"🧼"],
 ["Lip Balm","Cosmetics",4000,"💄"],["Insect Repellent Lotion","Cosmetics",7000,"🦟"],
 ["Baby Care Gift Kit","Cosmetics",45000,"🍼"],
 ["Vitamin C 1000mg (30 tabs)","Supplements",9000,"🍊"],["Multivitamin (30 tabs)","Supplements",15000,"🌿"],
 ["Zinc 20mg (30 tabs)","Supplements",10000,"⚡"],["Omega-3 Fish Oil (60 caps)","Supplements",28000,"🐟"],
 ["Calcium + Vitamin D (30 tabs)","Supplements",16000,"🦴"],["Iron + Folic Acid (30 tabs)","Supplements",8000,"🩸"],
 ["Digital Thermometer","Medical supplies",12000,"🌡️"],["Blood Pressure Monitor","Medical supplies",95000,"🩺"],
 ["Blood Glucose Meter","Medical supplies",65000,"📟"],["Pulse Oximeter","Medical supplies",45000,"🫀"],
 ["Malaria Rapid Test Kit","Medical supplies",5000,"🧪"],["Pregnancy Test Strip","Medical supplies",3000,"🧪"],
 ["Adhesive Plasters (40)","Medical supplies",3000,"🩹"],["Sterile Gauze & Bandage Pack","Medical supplies",6000,"🩹"],
 ["Face Masks (50)","Medical supplies",8000,"😷"],["Disposable Gloves (100)","Medical supplies",15000,"🧤"]
].map((a,i)=>({id:i,n:a[0],c:a[1],p:a[2],e:a[3],rx:!!a[4]}));
const PAGE=document.body.dataset.page||"";
const sink=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":typeof k==="symbol"?undefined:k==="length"?0:sink(),set:()=>true,apply:()=>sink()});
const $=s=>document.querySelector(s)||sink(), fmt=n=>"UGX "+n.toLocaleString("en-US");
let cat="All", cart={};
try{cart=JSON.parse(localStorage.getItem("believe-cart")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("believe-cart",JSON.stringify(cart))}catch(e){}};
let fav=[];try{fav=JSON.parse(localStorage.getItem("believe-fav")||"[]")}catch(e){}
const isFav=i=>fav.includes(String(i));
function saveFav(){try{localStorage.setItem("believe-fav",JSON.stringify(fav))}catch(e){}}
function paintHearts(){
  $("#favCount").textContent=fav.length;$("#favCount").hidden=!fav.length;
  document.querySelectorAll("[data-f]").forEach(el=>{const on=isFav(el.dataset.f);el.setAttribute("aria-pressed",on);if(el.id==="pfav")el.textContent=on?"♥ Saved":"♡ Save for later"})}
function toggleFav(id){id=String(id);fav=isFav(id)?fav.filter(x=>x!==id):[...fav,id];saveFav();paintHearts();bounceHearts(id);if(PAGE==="saved")renderSaved()}
function renderSaved(){
  if(PAGE!=="saved")return;
  const l=P.filter(p=>isFav(p.id));
  $("#savedGrid").innerHTML=l.length?l.map(cardHTML).join(""):'<p class="empty" style="grid-column:1/-1">You have not saved anything yet. Tap the heart on a product to keep it here for later. <a href="shop.html" style="color:var(--p)">Browse the shop</a></p>';
  paintHearts()}
const seen=new Set();try{JSON.parse(sessionStorage.getItem("believe-seen")||"[]").forEach(u=>seen.add(u))}catch(e){}
function markSeen(img){img.classList.add("loaded");const u=img.currentSrc||img.src;if(u&&!seen.has(u)){seen.add(u);try{sessionStorage.setItem("believe-seen",JSON.stringify([...seen].slice(-200)))}catch(e){}}}
let gridVer=0,gridBuilt=-1;
let prodsReady=false,prodsTried=false;
let waProduct=null;
const WA_Q=[["I would like to place an order","Hello BELIEVE Pharmacy, I would like to place an order."],["Is a product in stock?","Hello, I would like to check if a product is in stock: "],["Do you deliver to my area?","Hello, do you deliver to my area? I am in "],["Opening hours and branches","Hello, what are your opening hours and where are your branches?"],["I have a question for the pharmacist","Hello, I have a question for the pharmacist."]];
const SKEL=Array(8).fill('<div class="card sk"><div class="ph"></div><div class="b"><span class="sl" style="width:40%"></span><span class="sl" style="width:85%"></span><span class="sl" style="width:50%"></span></div></div>').join("");
const prod=i=>P.find(x=>String(x.id)===String(i));
function buildChips(){const cats=["All",...new Set(P.map(p=>p.c))];const qc=new URLSearchParams(location.search).get("cat");cat=cats.includes(qc)?qc:(cats.includes(cat)?cat:"All");
$("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}
$("#chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.c;document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()};
$("#q").oninput=draw;
const NOIMG='<svg class="noimg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l1 13H6L7 7z"/><path d="M9 7V6a3 3 0 016 0v1"/></svg>';
const priceHTML=p=>p.p?fmt(p.p)+(p.was?`<span class="was">${fmt(p.was)}</span>`:""):"Ask us";
const cardHTML=(p,i)=>`<div class="card" data-v="${p.id}"><div class="ph"><button class="heart" data-f="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="Save for later"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.5 1.1 4.3 2.4h.6C12.1 6.1 13.600 5 15.600 5 19 5 21.100 8.400 19.600 11.800 17.500 16.400 12 21 12 21z"/></svg></button>${p.was?`<span class="badge">-${p.pct}%</span>`:""}${p.img?`<img class="${seen.has(p.thumb||p.img)?"loaded":""}" src="${esc(p.thumb||p.img)}" alt="" loading="${i<8?"eager":"lazy"}" decoding="async" onload="markSeen(this)">`:NOIMG}</div><div class="b"><small>${esc(p.c)}</small><h4><a class="pv" href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.n)}</a></h4><div class="row"><b>${priceHTML(p)}</b>${p.stock!=null&&p.stock<=0?'<small>Out of stock</small>':`<button class="btn sm" data-a="${p.id}">Add</button>`}</div></div></div>`;
function draw(){
  if(SB&&!prodsTried){$("#grid").innerHTML=SKEL;gridBuilt=-1;return}
  if(gridBuilt!==gridVer){
    $("#grid").innerHTML=P.map(cardHTML).join("")+'<p class="empty" id="gridEmpty" style="grid-column:1/-1" hidden>No products match your search. Need something that requires a prescription? <a href="prescriptions.html" style="color:var(--p)">Upload your prescription here</a>, or <a href="consult.html" style="color:var(--p)">ask a pharmacist</a>.</p>';
    gridBuilt=gridVer}
  const q=String($("#q").value).toLowerCase();let n=0;
  document.querySelectorAll("#grid .card").forEach(c=>{const p=prod(c.dataset.v),ok=!!p&&(cat==="All"||p.c===cat)&&p.n.toLowerCase().includes(q);c.hidden=!ok;if(ok)n++});
  const e=document.getElementById("gridEmpty");if(e)e.hidden=n>0}
function cardClick(e){
  const f=e.target.closest("[data-f]");if(f){toggleFav(f.dataset.f);return}
  if(e.target.closest("a"))return;
  const b=e.target.closest("[data-a]");if(b){cart[b.dataset.a]=(cart[b.dataset.a]||0)+1;sync();openC();return}
  const v=e.target.closest("[data-v]");if(v)location.href="product.html?id="+encodeURIComponent(v.dataset.v)}
$("#grid").onclick=cardClick;$("#savedGrid").onclick=cardClick;$("#dealsGrid").onclick=cardClick;
// ===== Product page =====
function renderProductPage(){
  if(PAGE!=="product")return;
  const el=$("#pp"),id=new URLSearchParams(location.search).get("id"),p=prod(id);
  if(!p){el.innerHTML='<p class="empty">We could not find that product. <a href="shop.html" style="color:var(--p)">Back to the shop</a></p>';return}
  document.title=p.n+" · BELIEVE Pharmacy";
  waProduct=p.n;renderWa();
  const out=p.stock!=null&&p.stock<=0,st=p.stock==null?"":out?"Out of stock":p.stock<=5?"Only "+p.stock+" left":"In stock";
  const rel=P.filter(x=>x.c===p.c&&String(x.id)!==String(p.id)).slice(0,4);
  let q=1;
  el.innerHTML=`<a class="back" href="shop.html?cat=${encodeURIComponent(p.c)}">← ${esc(p.c)}</a>
  <div class="pp"><div class="pp-img"${p.thumb?` style="background:url('${esc(p.thumb)}') center/cover"`:""}>${p.was?`<span class="badge">-${p.pct}%</span>`:""}${p.img?`<img class="${seen.has(p.img)?"loaded":""}" src="${esc(p.img)}" alt="${esc(p.n)}" decoding="async" fetchpriority="high" onload="markSeen(this)">`:NOIMG}</div>
  <div class="pp-info"><small class="note">${esc(p.c)}</small><h1>${esc(p.n)}</h1><div class="pv-price">${priceHTML(p)}${p.was?` <span class="badge-inline">-${p.pct}%</span>`:""}</div>
  ${p.d?`<h3 class="about">About this product</h3><p class="pv-d">${esc(p.d)}</p>`:""}${st?`<p class="note" style="margin-top:10px">${st}</p>`:""}
  <div class="pp-buy"><div class="qty2"><button id="qm" aria-label="Less">−</button><span id="qn">1</span><button id="qp" aria-label="More">+</button></div><button class="btn" id="qadd" ${out?"disabled":""}>Add to basket</button><button class="btn ghost" id="pfav" data-f="${p.id}" aria-pressed="${isFav(p.id)}">${isFav(p.id)?"♥ Saved":"♡ Save for later"}</button></div>
  <a class="btn ghost" href="${waUrl("Hello, I am interested in "+p.n+(p.p?" ("+fmt(p.p)+")":""))}" target="_blank" rel="noopener">Ask about this on WhatsApp</a></div></div>
  ${rel.length?`<div class="rel"><h2>More in ${esc(p.c)}</h2><div class="grid">${rel.map(cardHTML).join("")}</div></div>`:""}`;
  el.onclick=e=>{const t=e.target;
    if(t.id==="qm"){q=Math.max(1,q-1);$("#qn").textContent=q;return}
    if(t.id==="qp"){q=Math.min(99,q+1);$("#qn").textContent=q;return}
    if(t.id==="qadd"){cart[p.id]=(cart[p.id]||0)+q;sync();openC();return}
    const f=t.closest("[data-f]");if(f){toggleFav(f.dataset.f);return}
    if(t.closest("a"))return;
    const b=t.closest("[data-a]");if(b){cart[b.dataset.a]=(cart[b.dataset.a]||0)+1;sync();openC();return}
    const v=t.closest("[data-v]");if(v)location.href="product.html?id="+encodeURIComponent(v.dataset.v)};
  try{
    const old=document.getElementById("buybar");if(old)old.remove();
    const bb=document.createElement("div");bb.id="buybar";bb.className="buybar";bb.setAttribute("aria-hidden","true");
    bb.innerHTML=`<div class="bb-t"><b>${esc(p.n)}</b><span>${priceHTML(p)}</span></div><button class="btn sm" id="bbAdd" tabindex="-1" ${out?"disabled":""}>Add to basket</button>`;
    document.body.appendChild(bb);
    bb.querySelector("#bbAdd").onclick=()=>{cart[p.id]=(cart[p.id]||0)+q;sync();openC()};
    const add=el.querySelector("#qadd");
    if("IntersectionObserver" in window&&add)new IntersectionObserver(([en])=>{const show=!en.isIntersecting&&en.boundingClientRect.top<0;bb.classList.toggle("show",show);bb.setAttribute("aria-hidden",String(!show));document.body.classList.toggle("bb",show)}).observe(add);
    const pi=el.querySelector(".pp-img");
    if(pi&&pi.querySelector("img")){
      const im=pi.querySelector("img");
      pi.classList.add("zoomable");pi.tabIndex=0;pi.setAttribute("role","button");pi.setAttribute("aria-label","Zoom the photo");
      const move=e=>{const r=pi.getBoundingClientRect();im.style.transformOrigin=((e.clientX-r.left)/r.width*100)+"% "+((e.clientY-r.top)/r.height*100)+"%"};
      pi.addEventListener("pointermove",e=>{if(pi.classList.contains("zoomed"))move(e)});
      pi.addEventListener("click",e=>{pi.classList.toggle("zoomed");if(pi.classList.contains("zoomed"))move(e)});
      pi.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pi.classList.toggle("zoomed")}});
      pi.addEventListener("mouseleave",()=>pi.classList.remove("zoomed"));
    }
  }catch(e){}
  scrollTo(0,0)}
function popCount(n){const el=$("#count");if(String(el.textContent)===String(n))return;el.textContent=n;if(el.classList&&el.classList.add){el.classList.remove("pop");void el.offsetWidth;el.classList.add("pop")}}
function bounceHearts(id){document.querySelectorAll('[data-f="'+id+'"]').forEach(el=>{el.classList.remove("bounce");void el.offsetWidth;el.classList.add("bounce");setTimeout(()=>el.classList.remove("bounce"),450)})}
function sync(){
  const ids=Object.keys(cart).filter(i=>{if(prod(i))return true;if(prodsReady)delete cart[i];return false});save();
  popCount(Object.values(cart).reduce((s,q)=>s+q,0));
  let t=0;
  $("#items").innerHTML=ids.length?ids.map(i=>{const p=prod(i),q=cart[i];t+=p.p*q;return `<div class="it"><span>${p.n}</span><b>${fmt(p.p*q)}</b><div class="qty"><button data-m="${i}" aria-label="Less">−</button>${q}<button data-pl="${i}" aria-label="More">+</button><button class="rm" data-r="${i}">Remove</button></div></div>`}).join(""):'<p class="empty" style="padding:40px 0">Your basket is empty. Add a product to start.</p>';
  $("#total").textContent=fmt(t);
}
$("#items").onclick=e=>{const t=e.target.dataset;if(t.m){if(--cart[t.m]<1)delete cart[t.m]}else if(t.pl)cart[t.pl]++;else if(t.r)delete cart[t.r];else return;sync()};
const openC=()=>{$("#drawer").classList.add("open");$("#veil").classList.add("open")},closeC=()=>{$("#drawer").classList.remove("open");$("#veil").classList.remove("open")};
$("#openCart").onclick=openC;$("#closeCart").onclick=closeC;$("#veil").onclick=closeC;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeC()});
function wa(text){window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(text),"_blank")}
$("#place").onclick=async()=>{
  const ids=Object.keys(cart);
  if(!ids.length){alert("Your basket is empty.");return}
  const del=$("#cDel").value,deliver=del.startsWith("Deliver"),addr=deliver?$("#cAddr").value.trim():"",pay=$("#cPay").value,branch=deliver?null:$("#cBranch").value;
  if(del.startsWith("Deliver")&&!addr){alert("Enter your delivery address.");return}
  const items=ids.map(i=>({id:prod(i).id,n:prod(i).n,q:cart[i],p:prod(i).p})),total=items.reduce((t,x)=>t+x.p*x.q,0);
  const lines=items.map(x=>`• ${x.q} × ${x.n} — ${fmt(x.p*x.q)}`).join("\n");
  if(!SB){wa(`New order, BELIEVE Pharmacy\n${lines}\nTotal: ${fmt(total)}\n${del}${addr?": "+addr:""}${branch?" ("+branch+")":""}\n${pay}`);cart={};sync();closeC();return}
  if(!cur){closeC();showAuth("up","Create an account or sign in to place and track your order.");return}
  const btn=$("#place");btn.disabled=true;
  // the server re-checks prices, stock and the total, and gives the order its number
  const {data:ord,error}=await SB.from("orders").insert({code:"pending",user_id:cur.id,items:items.map(x=>({id:x.id,q:x.q,n:x.n})),total,delivery:del,address:addr,payment:pay,branch}).select("code,total,items").single();
  btn.disabled=false;
  if(error){
    const m=error.message||"",s=m.match(/STOCK:(.+):(\d+)/);
    if(s){alert(`Sorry, ${s[1]} only has ${s[2]} left. Please lower the quantity and try again.`);refreshProducts();return}
    if(m.includes("ITEM_UNAVAILABLE")){alert("One of the items in your basket is no longer available. Please remove it and try again.");refreshProducts();return}
    alert("We could not place your order. Please try again, or order on WhatsApp.");return}
  const L=ord.items.map(x=>`• ${x.q} × ${x.n} — ${fmt(x.p*x.q)}`).join("\n");
  const msg=`New order ${ord.code}, BELIEVE Pharmacy\n${L}\nTotal: ${fmt(ord.total)}\nName: ${cur.name}\nPhone: ${cur.phone}\n${del}${addr?": "+addr:""}${branch?" ("+branch+")":""}\n${pay}`;
  flash=`<div class="ok" style="display:block;margin-top:12px">Order ${ord.code} placed. Total ${fmt(ord.total)}. <a href="${waUrl(msg)}" target="_blank" rel="noopener"><b>Also tell us on WhatsApp</b></a></div>`;
  cart={};sync();closeC();refreshProducts();showAuth();
};
$("#rxForm").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),o=$("#rxOk"),file=$("#rxFile").files[0];o.style.display="block";
  if(!SB){wa(`Prescription request, BELIEVE Pharmacy\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\n${f.get("delivery")}\nNotes: ${f.get("notes")||"-"}\n(I will attach the prescription file in this chat.)`);o.textContent="WhatsApp opened. Attach your prescription photo in the chat and send it.";return}
  if(!cur){showAuth("up","Create an account or sign in to send your prescription.");o.textContent="Please sign in first, then send your prescription.";return}
  if(file.size>8*1024*1024){o.textContent="That file is too large. Please choose a photo under 8 MB.";return}
  o.textContent="Uploading…";
  const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg",path=`${cur.id}/${Date.now()}.${ext}`;
  const up=await SB.storage.from("prescriptions").upload(path,file,{contentType:file.type||"application/octet-stream"});
  if(up.error){o.textContent="Upload failed. Please try again.";return}
  const {data,error}=await SB.from("prescriptions").insert({user_id:cur.id,name:f.get("name"),phone:f.get("phone"),notes:f.get("notes"),delivery:f.get("delivery"),file_path:path}).select("id").single();
  if(error){o.textContent="We could not save your request. Please try again.";return}
  const msg=`Prescription uploaded, BELIEVE Pharmacy\nRef: RX-${data.id}\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\n${f.get("delivery")}`;
  e.target.reset();o.innerHTML=`Prescription received (ref RX-${data.id}). Our pharmacist will verify it and contact you. <a href="${waUrl(msg)}" target="_blank" rel="noopener"><b>Message us on WhatsApp</b></a>`};
$("#cForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);
  wa(`Pharmacist consult, BELIEVE Pharmacy\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nAge: ${f.get("age")} (${f.get("who")})\nSymptoms: ${f.get("sym")}`);
  const o=$("#cOk");o.style.display="block";o.textContent="Sent. A pharmacist will reply with advice. For emergencies, go to the nearest hospital."};
// ===== Accounts, orders & tracking (Supabase) =====
const SB=(SUPABASE_URL&&SUPABASE_ANON_KEY&&window.supabase)?supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const waUrl=t=>"https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(t);
const STEPS=["Received","Confirmed","Preparing","Ready or on the way","Completed"];
let cur=null,flash="",mode="in";
async function loadUser(){
  cur=null;if(!SB)return;
  const {data:{session}}=await SB.auth.getSession();if(!session)return;
  const {data:p}=await SB.from("profiles").select("name,phone,is_admin").eq("id",session.user.id).maybeSingle();
  cur={id:session.user.id,email:session.user.email,name:p?.name||"",phone:p?.phone||"",admin:!!p?.is_admin};
}
function navUser(){$("#acct").textContent=cur?"Hi, "+(cur.name||"there").split(" ")[0]:"Sign in"}
function setMode(m){mode=m;const up=m==="up";
  document.querySelectorAll(".su").forEach(l=>{l.hidden=!up;l.querySelector("input").required=up});document.querySelectorAll(".suNote").forEach(n=>n.hidden=!up);
  $("#aTitle").textContent=up?"Create account":"Sign in";$("#aGo").textContent=up?"Create account":"Sign in";
  $("#aSwap").textContent=up?"Have an account? Sign in":"New here? Create an account";
  $("#authF [name=pw]").autocomplete=up?"new-password":"current-password";$("#aErr").textContent=""}
async function showAuth(m,msg){
  if(!SB){$("#vAuth").hidden=true;$("#vAcc").hidden=false;
    $("#vAcc").innerHTML=`<h3>Accounts coming soon</h3><p class="note">Online accounts are being set up. For now, order or ask us anything on WhatsApp.</p><div style="margin-top:18px;display:flex;gap:12px;align-items:center"><a class="btn sm" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">Open WhatsApp</a><button class="link" data-close>Close</button></div>`;
    if(!$("#auth").open)$("#auth").showModal();return}
  $("#vAuth").hidden=!!cur;$("#vAcc").hidden=!cur;
  if(cur)await renderAcc();else{setMode(m||"in");$("#aMsg").textContent=msg||"Track your orders and check out faster."}
  if(!$("#auth").open)$("#auth").showModal()}
const cancelHTML=o=>{
  if(o.status===5||o.status===4)return "";
  if(o.status<=1&&!o.paid)return `<div style="margin-top:10px"><button class="link" data-cancel="${o.id}" style="color:#d92d20">Cancel this order</button></div>`;
  return `<div class="note" style="margin-top:10px">To change or cancel this order, <a href="${waUrl("Hello, I would like to change or cancel my order "+o.code)}" target="_blank" rel="noopener" style="color:var(--p)">message us on WhatsApp</a>.</div>`};
async function renderAcc(){
  $("#vAcc").innerHTML='<p class="note">Loading…</p>';
  const {data:os,error}=await SB.from("orders").select("*").eq("user_id",cur.id).order("created_at",{ascending:false});
  const list=error?'<p class="err">Could not load your orders. Please try again.</p>':os.length?os.map(o=>`<div class="ord"><div class="h"><b>${esc(o.code)}</b><span>${fmt(o.total)}${o.paid?" · Paid":""}</span></div><small>${new Date(o.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} · ${esc(o.delivery||"")}${o.address?" · "+esc(o.address):""}${o.branch?" · "+esc(o.branch):""}</small>
  ${o.status===5?'<div class="stat" style="color:#d92d20;margin-top:10px">Cancelled</div>':`<div class="steps" aria-hidden="true">${STEPS.map((x,i)=>`<i class="${i<=o.status?"on":""}"></i>`).join("")}</div><div class="stat">${STEPS[o.status]||""}</div>`}<small>${(o.items||[]).map(x=>x.q+" × "+esc(x.n)).join(", ")}</small>${cancelHTML(o)}</div>`).join(""):'<p class="note" style="margin-top:8px">No orders yet. Add a product to your basket to place your first order.</p>';
  $("#vAcc").innerHTML=`<h3>Your account</h3><p class="note">${esc(cur.name)} · ${esc(cur.phone)} · ${esc(cur.email)}</p>${flash}${cur.admin?'<p style="margin-top:12px"><a class="btn sm" href="admin.html">Open admin dashboard</a></p>':""}<h4 style="margin-top:18px">Your orders</h4>${list}<div style="display:flex;gap:16px;margin-top:20px"><button class="btn sm" data-close>Close</button><button class="link" id="out">Sign out</button></div>`;
  flash=""}
$("#auth").addEventListener("click",async e=>{
  const cid=e.target.dataset&&e.target.dataset.cancel;
  if(cid){
    if(!confirm("Cancel this order? The items go back into stock and this cannot be undone."))return;
    const {error}=await SB.rpc("cancel_my_order",{p_id:Number(cid)});
    if(error)alert(/TOO_LATE/.test(error.message)?"This order is already being prepared or has been paid, so it can't be cancelled here. Please message us on WhatsApp.":"We could not cancel the order. Please try again, or message us on WhatsApp.");
    await renderAcc();refreshProducts();return}
  if(e.target.closest("[data-close]")||e.target===$("#auth"))$("#auth").close();
  if(e.target.id==="out"){await SB.auth.signOut();cur=null;navUser();$("#auth").close()}});
$("#aSwap").onclick=()=>setMode(mode==="in"?"up":"in");
$("#authF").onsubmit=async e=>{e.preventDefault();if(!SB)return;
  const f=new FormData(e.target),em=f.get("email").trim().toLowerCase(),pw=f.get("pw"),err=$("#aErr");err.textContent="";$("#aGo").disabled=true;
  const r=mode==="up"?await SB.auth.signUp({email:em,password:pw,options:{data:{name:(f.get("name")||"").trim(),phone:(f.get("phone")||"").trim()}}}):await SB.auth.signInWithPassword({email:em,password:pw});
  $("#aGo").disabled=false;
  if(r.error){err.textContent=mode==="up"?"We could not create the account: "+r.error.message:"Email or password is incorrect. Check them and try again.";return}
  if(!r.data.session){err.textContent="Almost done. Check your email and tap the confirmation link, then sign in.";return}
  e.target.reset();await loadUser();navUser();showAuth()};
$("#acct").onclick=()=>showAuth();
$("#trackL").onclick=e=>{e.preventDefault();showAuth("in","Sign in to see and track your orders.")};
function applyProducts(rows){
  P=rows.map(x=>{const on=x.sale_price!=null&&x.sale_price<x.price&&(!x.sale_ends||new Date(x.sale_ends)>new Date());return {was:on?x.price:null,pct:on?Math.round((1-x.sale_price/x.price)*100):0,id:x.id,d:x.description,n:x.name,c:x.category,p:on?x.sale_price:x.price,img:x.image_url,thumb:x.thumb_url,stock:x.stock}});
  gridVer++;prodsTried=true;buildChips();draw();prodsReady=true;fav=fav.filter(i=>prod(i));saveFav();
  sync();renderProductPage();renderSaved();renderDeals();renderDealsTile();paintHearts()}
async function refreshProducts(){
  if(!SB)return;
  const {data,error}=await SB.from("products").select("*").eq("active",true).order("category").order("name");
  if(!error&&data&&data.length){try{localStorage.setItem("believe-products",JSON.stringify(data))}catch(e){}applyProducts(data)}}
async function init(){
  if(!SB){prodsReady=true;sync();renderProductPage();renderSaved();renderDeals();renderDealsTile();paintHearts();return}
  SB.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_OUT"){cur=null;navUser()}});
  // 1. show the products from the last visit straight away
  let cachedStr="",cached=null;try{cachedStr=localStorage.getItem("believe-products")||"";cached=cachedStr?JSON.parse(cachedStr):null}catch(e){}
  if(cached&&cached.length)applyProducts(cached);
  // 2. ask for fresh products while the sign-in check runs
  const fresh=Promise.resolve(SB.from("products").select("*").eq("active",true).order("category").order("name"));
  await loadUser();navUser();
  if(PAGE==="careers")loadJobs();
  loadBanner();
  const {data,error}=await fresh;
  if(!error&&data&&data.length){
    const str=JSON.stringify(data);
    if(str!==cachedStr){try{localStorage.setItem("believe-products",str)}catch(e){}applyProducts(data)}
  }else if(!cached){prodsTried=true;buildChips();draw();sync();renderProductPage();renderSaved();renderDeals();renderDealsTile();paintHearts()}
}

// ===== Careers =====
let JOBS=[],applyJob=null,jobsLoaded=false;
function renderJobs(){
  const el=$("#jobs");
  if(!SB){el.innerHTML='<p class="empty" style="grid-column:1/-1">Vacancies will be listed here soon. Call or WhatsApp us to ask about jobs.</p>';return}
  if(!jobsLoaded){el.innerHTML='<p class="empty" style="grid-column:1/-1">Loading positions…</p>';return}
  el.innerHTML=JOBS.length?JOBS.map(j=>`<div class="job"><h3>${esc(j.title)}</h3><p>${esc(j.description||"")}</p><button class="btn sm" data-j="${j.id}">Apply</button></div>`).join(""):'<p class="empty" style="grid-column:1/-1">No open positions right now. Please check back soon.</p>'}
async function loadJobs(){const {data,error}=await SB.from("jobs").select("id,title,description").eq("active",true).order("id");if(!error&&data)JOBS=data;jobsLoaded=true;renderJobs()}
$("#jobs").onclick=e=>{const b=e.target.closest("[data-j]");if(!b||!SB)return;
  const j=JOBS.find(x=>String(x.id)===b.dataset.j);if(!j)return;
  if(!cur){showAuth("up","Create an account or sign in to apply. It only takes a minute.");return}
  applyJob=j;$("#jTitle").textContent="Apply: "+j.title;$("#jName").value=cur.name||"";$("#jPhone").value=cur.phone||"";$("#jEmail").value=cur.email||"";$("#jMsg").value="";$("#jCv").value="";$("#jOut").className="";$("#jOut").textContent="";$("#jGo").disabled=false;
  $("#jdlg").showModal()};
$("#jdlg").addEventListener("click",e=>{if(e.target.closest("[data-close]")||e.target===$("#jdlg"))$("#jdlg").close()});
$("#jForm").onsubmit=async e=>{e.preventDefault();
  const out=$("#jOut"),say=(c,t)=>{out.className=c;out.style.display="block";out.textContent=t},file=$("#jCv").files[0];
  const types={pdf:"application/pdf",doc:"application/msword",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"};
  if(!file){say("err","Please attach your CV.");return}
  const ext=(file.name.split(".").pop()||"").toLowerCase();
  if(!types[ext]){say("err","Please attach your CV as a PDF or Word file.");return}
  if(file.size>5*1024*1024){say("err","That file is too large. Please use a CV under 5 MB.");return}
  say("note","Sending your application…");$("#jGo").disabled=true;
  const path=`${cur.id}/${Date.now()}.${ext}`;
  const up=await SB.storage.from("cvs").upload(path,file,{contentType:types[ext]});
  if(up.error){say("err","The CV could not be uploaded. Please try again.");$("#jGo").disabled=false;return}
  const {error}=await SB.from("applications").insert({user_id:cur.id,job_id:applyJob.id,job_title:applyJob.title,name:$("#jName").value.trim(),phone:$("#jPhone").value.trim(),email:$("#jEmail").value.trim()||null,message:$("#jMsg").value.trim()||null,cv_path:path});
  if(error){say("err","We could not save your application. Please try again.");$("#jGo").disabled=false;return}
  say("ok","Application sent. Thank you! We will contact you if you are shortlisted.");e.target.reset()};
// ===== Deals and sale banner =====
function renderDeals(){
  if(PAGE!=="deals")return;
  const l=P.filter(p=>p.was);
  $("#dealsGrid").innerHTML=l.length?l.map(cardHTML).join(""):'<p class="empty" style="grid-column:1/-1">No deals right now. Check back soon, or <a href="shop.html" style="color:var(--p)">browse the shop</a>.</p>';
  paintHearts()}
function renderDealsTile(){
  if(PAGE!=="home")return;
  const l=P.filter(p=>p.was);
  if(!l.length){$("#dealsTile").hidden=true;return}
  $("#dealsH").textContent=l.length+(l.length===1?" deal":" deals")+" live";
  $("#dealsP").textContent="Up to "+Math.max(...l.map(p=>p.pct))+"% off, biggest savings first.";
  $("#dealsTile").hidden=false}
let promoEnd=null;
async function loadBanner(){
  if(!SB)return;
  const {data}=await SB.from("site_settings").select("*").eq("id",1).maybeSingle();
  if(!data||!data.banner_active||!data.banner_text)return;
  if(data.banner_ends&&new Date(data.banner_ends)<=new Date())return;
  let gone="";try{gone=sessionStorage.getItem("believe-promo-x")||""}catch(e){}
  if(gone===data.banner_text)return;
  promoEnd=data.banner_ends?new Date(data.banner_ends):null;
  $("#promoT").textContent=data.banner_text;$("#promoT").href=data.banner_link||"deals.html";
  $("#promo").hidden=false;tickPromo();setInterval(tickPromo,30000)}
function tickPromo(){
  if(!promoEnd){$("#promoC").textContent="";return}
  const ms=promoEnd-new Date();if(ms<=0){$("#promo").hidden=true;return}
  const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);
  $("#promoC").textContent="Ends in "+(d?d+"d ":"")+h+"h "+m+"m"}
$("#promoX").onclick=()=>{$("#promo").hidden=true;try{sessionStorage.setItem("believe-promo-x",$("#promoT").textContent)}catch(e){}};
// ===== Theme =====
const root=document.documentElement;
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem("believe-theme",t)}catch(e){}$("#theme").textContent=t==="dark"?"☀":"☾"}
$("#theme").onclick=()=>setTheme(root.dataset.theme==="dark"?"light":"dark");
setTheme(root.dataset.theme);navUser();
function renderBranches(){
  const ph=n=>`<a href="tel:+256${n.slice(1)}">${n.replace(/(\d{4})(\d{3})(\d{3})/,"$1 $2 $3")}</a>`;
  const gq=b=>encodeURIComponent(b.address+", Gulu, Uganda");
  $("#branches").innerHTML=BRANCHES.map(b=>`<div><h4>${esc(b.name)}</h4><p>${esc(b.address)}<br>${b.phones.map(ph).join(" · ")}${b.hours?"<br>"+esc(b.hours):""}</p><a class="btn sm" href="${esc(b.map||"https://www.google.com/maps/search/?api=1&query="+gq(b))}" target="_blank" rel="noopener">Get directions</a></div>`).join("")+
  `<div><h4>Fast delivery</h4><p>Delivery and WhatsApp orders<br><a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">+${WHATSAPP.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3 $4")}</a>${EMAIL?`<br><a href="mailto:${esc(EMAIL)}">${esc(EMAIL)}</a>`:""}</p></div>`}
function renderSocials(){
  const I={
   instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
   facebook:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.500c0-.700.200-1 1.100-1H17V2h-2.600C11.500 2 10 3.600 10 6v2H7.500v3.500H10V22h4V11.500h2.700L17 8z"/></svg>',
   tiktok:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.600 5.800A4.300 4.300 0 0 1 15.500 3h-3.100v12.400a2.600 2.600 0 1 1-2.600-2.600c.3 0 .5 0 .8.100V9.700a5.700 5.700 0 1 0 4.900 5.700V9a7.400 7.400 0 0 0 4.300 1.400V7.300a4.300 4.300 0 0 1-3.200-1.500z"/></svg>'};
  const L={instagram:"Instagram",facebook:"Facebook",tiktok:"TikTok"};
  const socHTML=Object.keys(I).filter(k=>SOCIALS[k]).map(k=>`<a href="${esc(SOCIALS[k])}" target="_blank" rel="noopener" aria-label="BELIEVE Pharmacy on ${L[k]}">${I[k]}</a>`).join("");$("#soc").innerHTML=socHTML;
}
renderSocials();
renderBranches();
buildChips();
draw();sync();
function syncDelivery(){const d=$("#cDel").value.startsWith("Deliver");$("#cAddr").hidden=!d;$("#cBranch").hidden=d}
$("#cBranch").innerHTML=BRANCHES.map(b=>`<option>${esc(b.name)}</option>`).join("");
$("#cDel").onchange=syncDelivery;syncDelivery();
renderJobs();
paintHearts();
if(SB){["#dealsGrid","#savedGrid"].forEach(s=>{if(document.querySelector(s))$(s).innerHTML=SKEL})}
init();

// ===== Mobile menu =====
(function(){const mb=document.getElementById("menuBtn"),nl=document.getElementById("navLinks");
  if(!mb||!nl)return;
  mb.onclick=()=>{const o=nl.classList.toggle("open");mb.setAttribute("aria-expanded",o)};
  nl.onclick=e=>{if(e.target.closest("a"))nl.classList.remove("open")}})();

// ===== Home photo slider =====
(function(){
  const s=document.getElementById("slider");if(!s)return;
  const track=s.querySelector(".track"),slides=[...s.querySelectorAll(".slide")],dotsEl=s.querySelector(".sdots");
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i=0,timer=null,paused=false;
  slides.forEach((_,n)=>{const b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show photo "+(n+1));b.onclick=()=>{go(n);restart()};dotsEl.appendChild(b)});
  function go(n){i=(n+slides.length)%slides.length;track.style.transform="translateX(-"+i*100+"%)";
    [...dotsEl.children].forEach((b,k)=>b.setAttribute("aria-current",k===i));
    slides.forEach((sl,k)=>sl.setAttribute("aria-hidden",k!==i))}
  function play(){if(reduce||timer||paused||document.hidden)return;timer=setInterval(()=>go(i+1),4500)}
  function stop(){clearInterval(timer);timer=null}
  function restart(){stop();play()}
  s.addEventListener("mouseenter",()=>{paused=true;stop()});
  s.addEventListener("mouseleave",()=>{paused=false;play()});
  s.addEventListener("focusin",()=>{paused=true;stop()});
  s.addEventListener("focusout",()=>{paused=false;play()});
  s.querySelector(".prev").onclick=()=>{go(i-1);restart()};
  s.querySelector(".next").onclick=()=>{go(i+1);restart()};
  s.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){go(i-1);restart()}else if(e.key==="ArrowRight"){go(i+1);restart()}});
  let x0=null;
  s.addEventListener("pointerdown",e=>{x0=e.clientX});
  s.addEventListener("pointerup",e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));restart()}});
  s.addEventListener("pointercancel",()=>{x0=null});
  document.addEventListener("visibilitychange",()=>{document.hidden?stop():play()});
  window.addEventListener("load",()=>{slides.forEach(sl=>{const im=sl.querySelector("img");if(im)im.loading="eager"})});
  go(0);play();
})();

// ===== Motion: scroll reveals and the pinned story =====
(function(){
  const calm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Story: the photo stays put while the text changes
  const steps=[...document.querySelectorAll(".story-step")],imgs=[...document.querySelectorAll(".story-frame img")];
  if(steps.length&&imgs.length){
    const set=i=>{imgs.forEach((im,k)=>im.classList.toggle("on",k===i));steps.forEach((s,k)=>s.classList.toggle("active",k===i))};
    set(0);
    if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set(steps.indexOf(e.target))}),{rootMargin:"-45% 0px -45% 0px"});steps.forEach(s=>io.observe(s))}
  }
  // Reveals: only things below the screen get hidden, so nothing flickers at the top
  if(calm||!("IntersectionObserver" in window))return;
  const sel="main h1.pt,main h2,main .sub,main .tile,main .how-card,main .step,main .deal-card,#contact .ctc>div";
  const els=[...document.querySelectorAll(sel)].filter(e=>!e.closest(".story")&&e.getBoundingClientRect().top>innerHeight*0.92);
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const t=en.target;t.classList.add("in");io.unobserve(t);setTimeout(()=>{t.classList.remove("rv","in");t.style.removeProperty("--d")},1300)}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  const count=new Map();
  els.forEach(e=>{const p=e.parentElement,i=count.get(p)||0;count.set(p,i+1);e.style.setProperty("--d",Math.min(i,5)*0.08+"s");e.classList.add("rv");io.observe(e)});
})();

// ===== WhatsApp quick questions =====
function renderWa(){
  const q=WA_Q.map(x=>x.slice());
  if(waProduct)q[1]=["Is "+waProduct+" in stock?","Hello, is "+waProduct+" in stock?"];
  $("#waQ").innerHTML=q.map(([l,m])=>`<a href="${waUrl(m)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}
(function(){
  const b=document.getElementById("waBtn"),pop=document.getElementById("waPop");if(!b||!pop)return;
  const open=o=>{pop.hidden=!o;b.setAttribute("aria-expanded",String(o))};
  b.addEventListener("click",e=>{e.preventDefault();open(pop.hidden)});
  document.getElementById("waX").addEventListener("click",()=>{open(false);b.focus()});
  pop.addEventListener("click",e=>{if(e.target.closest("a"))open(false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!pop.hidden){open(false);b.focus()}});
  document.addEventListener("click",e=>{if(!pop.hidden&&!e.target.closest(".wa-wrap"))open(false)});
  renderWa()})();
