
// ===== SETTINGS: change these =====
const WHATSAPP = "256709714959"; // pharmacy WhatsApp number, no + or spaces
// ===== BRANCH DETAILS: edit the text inside the quotes =====
const BRANCHES = [
  { name: "Olya Road",   address: "Plot 26, Olya Road, Pece-Laroo, Gulu City East",   phones: ["0393001498", "0709714959"], hours: "Mon–Sat 8:00–20:00", map: "", embed: "" },
  { name: "Acholi Road", address: "Plot 5, Acholi Road, Bus Park, Gulu", phones: ["0393003737"],               hours: "Mon–Sat 8:00–20:00", map: "", embed: "" }
]; // hours: leave "" to hide it.
// MAPS: by default each map is found from the address. For an exact pin, open the branch on Google Maps, click Share > Embed a map, copy the link inside src="..." into embed, and paste the normal share link into map.
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
function toggleFav(id){id=String(id);fav=isFav(id)?fav.filter(x=>x!==id):[...fav,id];saveFav();paintHearts();if(PAGE==="saved")renderSaved()}
function renderSaved(){
  if(PAGE!=="saved")return;
  const l=P.filter(p=>isFav(p.id));
  $("#savedGrid").innerHTML=l.length?l.map(cardHTML).join(""):'<p class="empty" style="grid-column:1/-1">You have not saved anything yet. Tap the heart on a product to keep it here for later. <a href="shop.html" style="color:var(--p)">Browse the shop</a></p>';
  paintHearts()}
let prodsReady=false;
const prod=i=>P.find(x=>String(x.id)===String(i));
function buildChips(){const cats=["All",...new Set(P.map(p=>p.c))];const qc=new URLSearchParams(location.search).get("cat");cat=cats.includes(qc)?qc:(cats.includes(cat)?cat:"All");
$("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}
$("#chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.c;document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()};
$("#q").oninput=draw;
const NOIMG='<svg class="noimg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l1 13H6L7 7z"/><path d="M9 7V6a3 3 0 016 0v1"/></svg>';
const priceHTML=p=>p.p?fmt(p.p)+(p.was?`<span class="was">${fmt(p.was)}</span>`:""):"Ask us";
const cardHTML=p=>`<div class="card" data-v="${p.id}"><div class="ph"><button class="heart" data-f="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="Save for later"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.5 1.1 4.3 2.4h.6C12.1 6.1 13.600 5 15.600 5 19 5 21.100 8.400 19.600 11.800 17.500 16.400 12 21 12 21z"/></svg></button>${p.was?`<span class="badge">-${p.pct}%</span>`:""}${p.img?`<img src="${esc(p.img)}" alt="" loading="lazy">`:NOIMG}</div><div class="b"><small>${esc(p.c)}</small><h4><a class="pv" href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.n)}</a></h4><div class="row"><b>${priceHTML(p)}</b>${p.stock!=null&&p.stock<=0?'<small>Out of stock</small>':`<button class="btn sm" data-a="${p.id}">Add</button>`}</div></div></div>`;
function draw(){
  const q=$("#q").value.toLowerCase();
  const l=P.filter(p=>(cat==="All"||p.c===cat)&&p.n.toLowerCase().includes(q));
  $("#grid").innerHTML=l.length?l.map(cardHTML).join(""):'<p class="empty" style="grid-column:1/-1">No products match your search. Need something that requires a prescription? <a href="prescriptions.html" style="color:var(--p)">Upload your prescription here</a>, or <a href="consult.html" style="color:var(--p)">ask a pharmacist</a>.</p>';
}
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
  const out=p.stock!=null&&p.stock<=0,st=p.stock==null?"":out?"Out of stock":p.stock<=5?"Only "+p.stock+" left":"In stock";
  const rel=P.filter(x=>x.c===p.c&&String(x.id)!==String(p.id)).slice(0,4);
  let q=1;
  el.innerHTML=`<a class="back" href="shop.html?cat=${encodeURIComponent(p.c)}">← ${esc(p.c)}</a>
  <div class="pp"><div class="pp-img">${p.was?`<span class="badge">-${p.pct}%</span>`:""}${p.img?`<img src="${esc(p.img)}" alt="${esc(p.n)}">`:NOIMG}</div>
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
  scrollTo(0,0)}
function sync(){
  const ids=Object.keys(cart).filter(i=>{if(prod(i))return true;if(prodsReady)delete cart[i];return false});save();
  $("#count").textContent=Object.values(cart).reduce((s,q)=>s+q,0);
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
  const del=$("#cDel").value,addr=$("#cAddr").value.trim(),pay=$("#cPay").value;
  if(del.startsWith("Deliver")&&!addr){alert("Enter your delivery address.");return}
  const items=ids.map(i=>({n:prod(i).n,q:cart[i],p:prod(i).p})),total=items.reduce((t,x)=>t+x.p*x.q,0);
  const lines=items.map(x=>`• ${x.q} × ${x.n} — ${fmt(x.p*x.q)}`).join("\n");
  if(!SB){wa(`New order, BELIEVE Pharmacy\n${lines}\nTotal: ${fmt(total)}\n${del}${addr?": "+addr:""}\n${pay}`);cart={};sync();closeC();return}
  if(!cur){closeC();showAuth("up","Create an account or sign in to place and track your order.");return}
  const btn=$("#place");btn.disabled=true;
  const code="BP-"+Math.floor(10000+Math.random()*90000);
  const {error}=await SB.from("orders").insert({code,user_id:cur.id,items,total,delivery:del,address:addr,payment:pay});
  btn.disabled=false;
  if(error){alert("We could not place your order. Please try again, or order on WhatsApp.");return}
  const msg=`New order ${code}, BELIEVE Pharmacy\n${lines}\nTotal: ${fmt(total)}\nName: ${cur.name}\nPhone: ${cur.phone}\n${del}${addr?": "+addr:""}\n${pay}`;
  flash=`<div class="ok" style="display:block;margin-top:12px">Order ${code} placed. <a href="${waUrl(msg)}" target="_blank" rel="noopener"><b>Also tell us on WhatsApp</b></a></div>`;
  cart={};sync();closeC();showAuth();
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
  document.querySelectorAll(".su").forEach(l=>{l.hidden=!up;l.querySelector("input").required=up});
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
async function renderAcc(){
  $("#vAcc").innerHTML='<p class="note">Loading…</p>';
  const {data:os,error}=await SB.from("orders").select("*").eq("user_id",cur.id).order("created_at",{ascending:false});
  const list=error?'<p class="err">Could not load your orders. Please try again.</p>':os.length?os.map(o=>`<div class="ord"><div class="h"><b>${esc(o.code)}</b><span>${fmt(o.total)}</span></div><small>${new Date(o.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} · ${esc(o.delivery||"")}${o.address?" · "+esc(o.address):""}</small>
  <div class="steps" aria-hidden="true">${STEPS.map((x,i)=>`<i class="${i<=o.status?"on":""}"></i>`).join("")}</div>
  <div class="stat">${STEPS[o.status]||""}</div><small>${(o.items||[]).map(x=>x.q+" × "+esc(x.n)).join(", ")}</small></div>`).join(""):'<p class="note" style="margin-top:8px">No orders yet. Add a product to your basket to place your first order.</p>';
  $("#vAcc").innerHTML=`<h3>Your account</h3><p class="note">${esc(cur.name)} · ${esc(cur.phone)} · ${esc(cur.email)}</p>${flash}${cur.admin?'<p style="margin-top:12px"><a class="btn sm" href="admin.html">Open admin dashboard</a></p>':""}<h4 style="margin-top:18px">Your orders</h4>${list}<div style="display:flex;gap:16px;margin-top:20px"><button class="btn sm" data-close>Close</button><button class="link" id="out">Sign out</button></div>`;
  flash=""}
$("#auth").addEventListener("click",async e=>{
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
async function init(){
  if(!SB){prodsReady=true;sync();renderProductPage();renderSaved();renderDeals();renderDealsTile();paintHearts();return}
  SB.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_OUT"){cur=null;navUser()}});
  await loadUser();navUser();
  if(PAGE==="careers")loadJobs();
  loadBanner();
  const {data,error}=await SB.from("products").select("*").eq("active",true).order("category").order("name");
  if(!error&&data&&data.length){P=data.map(x=>{const on=x.sale_price!=null&&x.sale_price<x.price&&(!x.sale_ends||new Date(x.sale_ends)>new Date());return {was:on?x.price:null,pct:on?Math.round((1-x.sale_price/x.price)*100):0,id:x.id,d:x.description,n:x.name,c:x.category,p:on?x.sale_price:x.price,e:x.emoji||"🛍️",img:x.image_url,stock:x.stock}});buildChips();draw();prodsReady=true;fav=fav.filter(i=>prod(i));saveFav()}
  sync();renderProductPage();renderSaved();renderDeals();renderDealsTile();paintHearts();
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
  $("#branches").innerHTML=BRANCHES.map(b=>`<div><h4>${esc(b.name)}</h4><p>${esc(b.address)}<br>${b.phones.map(ph).join(" · ")}${b.hours?"<br>"+esc(b.hours):""}<br><a href="${esc(b.map||"https://www.google.com/maps/search/?api=1&query="+gq(b))}" target="_blank" rel="noopener">Get directions</a></p><iframe title="Map showing the ${esc(b.name)} branch" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${esc(b.embed||"https://maps.google.com/maps?q="+gq(b)+"&output=embed")}"></iframe></div>`).join("")+
  `<div><h4>Fast delivery</h4><p>Order on WhatsApp<br><a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">+${WHATSAPP.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/,"$1 $2 $3 $4")}</a>${EMAIL?`<br><a href="mailto:${esc(EMAIL)}">${esc(EMAIL)}</a>`:""}</p></div>`}
function renderSocials(){
  const I={
   instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
   facebook:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.500c0-.700.200-1 1.100-1H17V2h-2.600C11.500 2 10 3.600 10 6v2H7.500v3.500H10V22h4V11.500h2.700L17 8z"/></svg>',
   tiktok:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.600 5.800A4.300 4.300 0 0 1 15.500 3h-3.100v12.400a2.600 2.600 0 1 1-2.600-2.600c.3 0 .5 0 .8.100V9.700a5.700 5.700 0 1 0 4.900 5.700V9a7.400 7.400 0 0 0 4.300 1.400V7.300a4.300 4.300 0 0 1-3.200-1.500z"/></svg>'};
  const L={instagram:"Instagram",facebook:"Facebook",tiktok:"TikTok"};
  const socHTML=Object.keys(I).filter(k=>SOCIALS[k]).map(k=>`<a href="${esc(SOCIALS[k])}" target="_blank" rel="noopener" aria-label="BELIEVE Pharmacy on ${L[k]}">${I[k]}</a>`).join("");$("#soc").innerHTML=socHTML;$("#soc2").innerHTML=socHTML;
}
renderSocials();
renderBranches();
buildChips();
draw();sync();
renderJobs();
paintHearts();
init();

// ===== Mobile menu =====
(function(){const mb=document.getElementById("menuBtn"),nl=document.getElementById("navLinks");
  if(!mb||!nl)return;
  mb.onclick=()=>{const o=nl.classList.toggle("open");mb.setAttribute("aria-expanded",o)};
  nl.onclick=e=>{if(e.target.closest("a"))nl.classList.remove("open")}})();
