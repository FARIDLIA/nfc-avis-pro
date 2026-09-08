const STORAGE_KEY = "nfc-avis-pro:shops:v1";
const COUNT_KEY = "nfc-avis-pro:daily-count:v1";
const $ = (id) => document.getElementById(id);
const state = { shops: [], scanController: null, deferredInstall: null };

function toast(message, error = false) {
  const el = $("toast");
  el.textContent = message;
  el.className = `toast show${error ? " error" : ""}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (el.className = "toast"), 3200);
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "https:") throw new Error("Le lien doit commencer par https://");
  return url.href;
}

function getFormData() {
  const name = $("shopName").value.trim();
  if (!name) throw new Error("Indiquez le nom de la boutique.");
  const url = normalizeUrl($("reviewUrl").value);
  return { id: crypto.randomUUID(), name, url, note: $("note").value.trim(), updatedAt: new Date().toISOString() };
}

function loadShops() {
  try { state.shops = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { state.shops = []; }
  renderShops();
}

function persistShops() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shops));
  renderShops();
}

function saveCurrent() {
  try {
    const entry = getFormData();
    const existing = state.shops.findIndex((shop) => shop.url === entry.url);
    if (existing >= 0) state.shops[existing] = { ...state.shops[existing], ...entry, id: state.shops[existing].id };
    else state.shops.unshift(entry);
    persistShops();
    toast("Fiche commerce enregistrée.");
  } catch (error) { toast(error.message, true); }
}

function renderShops(filter = "") {
  $("shopCount").textContent = state.shops.length;
  const needle = filter.toLocaleLowerCase("fr");
  const shops = state.shops.filter((shop) => `${shop.name} ${shop.note || ""}`.toLocaleLowerCase("fr").includes(needle));
  if (!shops.length) {
    $("shopList").innerHTML = `<div class="empty-list"><strong>${state.shops.length ? "Aucun résultat" : "Aucun commerce enregistré"}</strong><p>${state.shops.length ? "Modifiez votre recherche." : "Enregistrez votre première fiche depuis l’onglet Programmer."}</p></div>`;
    return;
  }
  $("shopList").innerHTML = shops.map((shop) => `<div class="shop-item">
    <span class="shop-avatar">${escapeHtml(shop.name.charAt(0).toUpperCase())}</span>
    <span class="shop-copy"><strong>${escapeHtml(shop.name)}</strong><small>${escapeHtml(shop.note || shop.url)}</small></span>
    <span class="shop-actions"><button class="icon-btn use-shop" data-id="${shop.id}" type="button">Utiliser</button><button class="icon-btn danger delete-shop" data-id="${shop.id}" type="button">Supprimer</button></span>
  </div>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function useShop(id) {
  const shop = state.shops.find((item) => item.id === id);
  if (!shop) return;
  $("shopName").value = shop.name;
  $("reviewUrl").value = shop.url;
  $("note").value = shop.note || "";
  showPanel("programmer");
  toast(`${shop.name} est prêt à programmer.`);
}

function setOperation(mode, title, detail) {
  $("nfcStage").className = `nfc-stage ${mode}`;
  $("operationMessage").innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span>`;
}

function incrementCount() {
  const today = new Date().toISOString().slice(0, 10);
  let data;
  try { data = JSON.parse(localStorage.getItem(COUNT_KEY) || "{}"); } catch { data = {}; }
  data = data.date === today ? data : { date: today, count: 0 };
  data.count += 1;
  localStorage.setItem(COUNT_KEY, JSON.stringify(data));
  $("todayCount").textContent = data.count;
}

function displayCount() {
  const today = new Date().toISOString().slice(0, 10);
  try { const data = JSON.parse(localStorage.getItem(COUNT_KEY) || "{}"); $("todayCount").textContent = data.date === today ? data.count : 0; }
  catch { $("todayCount").textContent = 0; }
}

async function writeTag(event) {
  event.preventDefault();
  try {
    const entry = getFormData();
    if (!("NDEFReader" in window)) throw new Error("Web NFC n’est pas disponible. Utilisez Chrome sur un téléphone Android NFC.");
    const button = $("writeButton");
    button.disabled = true;
    setOperation("working", "Approchez la puce", "Maintenez le dos du téléphone contre la puce jusqu’à confirmation.");
    const ndef = new NDEFReader();
    await ndef.write({ records: [{ recordType: "url", data: entry.url }] }, { overwrite: true });
    setOperation("success", "Carte programmée", `${entry.name} · Écriture terminée avec succès.`);
    incrementCount();
    const existing = state.shops.findIndex((shop) => shop.url === entry.url);
    if (existing < 0) { state.shops.unshift(entry); persistShops(); }
    else { state.shops[existing] = { ...state.shops[existing], ...entry, id: state.shops[existing].id }; persistShops(); }
    if (navigator.vibrate) navigator.vibrate([70, 50, 120]);
    toast("Écriture NFC réussie.");
    button.disabled = false;
  } catch (error) {
    $("writeButton").disabled = false;
    setOperation("error", "Écriture interrompue", friendlyNfcError(error));
    toast(friendlyNfcError(error), true);
  }
}

function friendlyNfcError(error) {
  const name = error && error.name;
  if (name === "NotAllowedError") return "Autorisation NFC refusée. Autorisez-la dans Chrome puis recommencez.";
  if (name === "NotSupportedError") return "Cette puce n’est pas compatible NDEF ou n’est pas formatée.";
  if (name === "NotReadableError") return "La puce a été retirée trop tôt ou elle est protégée en écriture.";
  if (name === "AbortError") return "Opération NFC annulée.";
  return error && error.message ? error.message : "Impossible de communiquer avec la puce NFC.";
}

async function scanTag() {
  try {
    if (!("NDEFReader" in window)) throw new Error("Lecture disponible uniquement dans Chrome sur Android NFC.");
    state.scanController = new AbortController();
    const ndef = new NDEFReader();
    await ndef.scan({ signal: state.scanController.signal });
    $("scanButton").disabled = true;
    $("stopScanButton").classList.remove("hidden");
    $("scanResult").innerHTML = `<p class="eyebrow">LECTURE EN COURS</p><div class="empty-result"><span>N</span><strong>Approchez une carte</strong><small>Maintenez-la contre le dos du téléphone.</small></div>`;
    ndef.addEventListener("readingerror", () => toast("Carte détectée, mais contenu illisible.", true));
    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      const records = [...message.records];
      const values = records.map(decodeRecord).filter(Boolean);
      const firstUrl = values.find((item) => item.type === "url");
      $("scanResult").innerHTML = `<p class="eyebrow">CARTE VALIDÉE</p><div class="result-box">
        <div class="result-line"><span>IDENTIFIANT DE PUCE</span><strong>${escapeHtml(serialNumber || "Non communiqué par l’appareil")}</strong></div>
        <div class="result-line"><span>TYPE DE CONTENU</span><strong>${escapeHtml(records.map((r) => r.recordType).join(", ") || "Inconnu")}</strong></div>
        <div class="result-line"><span>DESTINATION</span><strong class="result-link">${escapeHtml(firstUrl ? firstUrl.value : values.map((v) => v.value).join(" · ") || "Aucune donnée décodable")}</strong></div>
      </div>`;
      toast("Lecture terminée : carte contrôlée.");
      if (navigator.vibrate) navigator.vibrate(100);
      stopScan();
    });
  } catch (error) { toast(friendlyNfcError(error), true); stopScan(); }
}

function decodeRecord(record) {
  try {
    const decoder = new TextDecoder(record.encoding || "utf-8");
    if (record.recordType === "url" || record.recordType === "text" || record.recordType === "absolute-url") return { type: record.recordType === "text" ? "text" : "url", value: decoder.decode(record.data) };
    return { type: record.recordType, value: decoder.decode(record.data) };
  } catch { return null; }
}

function stopScan() {
  if (state.scanController) state.scanController.abort();
  state.scanController = null;
  $("scanButton").disabled = false;
  $("stopScanButton").classList.add("hidden");
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active-panel", panel.id === id));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.target === id));
  window.scrollTo({ top: document.querySelector(".tabs").offsetTop - 10, behavior: "smooth" });
}

function exportData() {
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), shops: state.shops }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `nfc-avis-pro-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importData(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.shops)) throw new Error("Fichier de sauvegarde non reconnu.");
    state.shops = data.shops.filter((s) => s && typeof s.name === "string" && typeof s.url === "string");
    persistShops();
    toast(`${state.shops.length} commerce(s) importé(s).`);
  } catch (error) { toast(error.message, true); }
}

function initCompatibility() {
  const box = $("compatibility");
  if ("NDEFReader" in window && window.isSecureContext) {
    box.classList.add("ready");
    box.querySelector("strong").textContent = "NFC prêt à l’emploi";
    box.querySelector("small").textContent = "NTAG213 · 215 · 216";
  } else {
    box.classList.add("error");
    box.querySelector("strong").textContent = "Mode consultation";
    box.querySelector("small").textContent = window.isSecureContext ? "Ouvrez avec Chrome sur Android" : "Connexion HTTPS requise";
  }
}

document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => showPanel(tab.dataset.target)));
$("writeForm").addEventListener("submit", writeTag);
$("saveButton").addEventListener("click", saveCurrent);
$("placeIdToggle").addEventListener("click", () => $("placeIdBox").classList.toggle("hidden"));
$("buildUrl").addEventListener("click", () => { const id = $("placeId").value.trim(); if (!id) return toast("Saisissez le Place ID Google.", true); $("reviewUrl").value = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(id)}`; toast("Lien d’avis généré."); });
$("shopSearch").addEventListener("input", (event) => renderShops(event.target.value));
$("shopList").addEventListener("click", (event) => { const use = event.target.closest(".use-shop"); const del = event.target.closest(".delete-shop"); if (use) useShop(use.dataset.id); if (del && confirm("Supprimer définitivement cette fiche commerce ?")) { state.shops = state.shops.filter((s) => s.id !== del.dataset.id); persistShops(); } });
$("scanButton").addEventListener("click", scanTag);
$("stopScanButton").addEventListener("click", stopScan);
$("exportButton").addEventListener("click", exportData);
$("importButton").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (event) => { if (event.target.files[0]) importData(event.target.files[0]); event.target.value = ""; });
window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); state.deferredInstall = event; $("installButton").classList.remove("hidden"); });
$("installButton").addEventListener("click", async () => { if (!state.deferredInstall) return; state.deferredInstall.prompt(); await state.deferredInstall.userChoice; state.deferredInstall = null; $("installButton").classList.add("hidden"); });
window.addEventListener("appinstalled", () => toast("NFC Avis Pro est installé."));
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));

initCompatibility();
loadShops();
displayCount();
