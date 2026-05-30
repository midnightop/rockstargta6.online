/**
 * GigHub Kolkata - Core Execution Architecture Kernel
 * Custom engineered for Vanilla static ES6+ deployments.
 */

// 1. BACKEND INITIALIZATION GATEWAY SETUP
const SUPABASE_URL = "https://your-supabase-url.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here";

const supabase = (window.supabase && SUPABASE_URL.indexOf("your-supabase") === -1) 
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

// 2. HIGH-FIDELITY HYPERLOCAL DATA ASSETS
const KOLKATA_MOCK_GIGS = [
    { id: "g-1", title: "Specialty Assistant Barista", business_name: "Roastery Cafe Gariahat", location: "Gariahat", payout_amount: 140, timing: "09:00 AM - 02:00 PM (Weekend)", is_sos: true, rating: 4.9 },
    { id: "g-2", title: "Heritage Event Steward", business_name: "Flurys Park Street", location: "Park Street", payout_amount: 160, timing: "06:00 PM - 11:00 PM (Urgent Shift)", is_sos: true, rating: 4.8 },
    { id: "g-3", title: "Textbook Cataloguer", business_name: "College Street Publishers", location: "College Street", payout_amount: 110, timing: "11:00 AM - 04:00 PM (Flexible)", is_sos: false, rating: 4.5 },
    { id: "g-4", title: "Operations Executive", business_name: "Salt Lake Sector V Tech Hub", location: "Salt Lake Sector V", payout_amount: 200, timing: "01:00 PM - 06:00 PM (Hybrid)", is_sos: false, rating: 4.7 },
    { id: "g-5", title: "Weekend Counter Associate", business_name: "Gariahat Fashion Outlet", location: "Gariahat", payout_amount: 130, timing: "03:00 PM - 09:00 PM (Festive)", is_sos: false, rating: 4.3 }
];

const KOLKATA_MOCK_STUDENTS = [
    { id: "s-1", full_name: "Arjun Chakraborty", college_name: "Jadavpur University", location: "Salt Lake Sector V", rating: 4.9, xp_points: 650, skills: ["Barista Certified", "On-Time Legend", "Retail Strategy"] },
    { id: "s-2", full_name: "Priya Sengupta", college_name: "Calcutta University", location: "Gariahat", rating: 4.7, xp_points: 480, skills: ["Event Architecture", "Public Relations"] },
    { id: "s-3", full_name: "Rohan Dey", college_name: "Asutosh College", location: "College Street", rating: 4.4, xp_points: 210, skills: ["Inventory Management", "Fast Typing"] },
    { id: "s-4", full_name: "Aisha Khan", college_name: "St. Xavier's College", location: "Park Street", rating: 4.8, xp_points: 820, skills: ["Social Media Architect", "Copywriting"] },
    { id: "s-5", full_name: "Vikram Singh", college_name: "Presidency University", location: "New Town", rating: 4.6, xp_points: 310, skills: ["Guest Handling", "Fluent English"] }
];

// 3. MASTER LOCAL APP MEMORY KERNEL STATE
let appState = {
    userSession: null,
    profile: {
        id: "sandbox-user-id-" + Math.random().toString(36).substr(2, 9),
        full_name: "",
        role_type: "student", 
        college_name: "",
        company_name: "",
        location: "",
        rating: 5.0,
        xp_points: 120
    },
    activeDeckCards: [],
    currentCardIndex: 0,
    activeMatchContext: null
};

// 4. LIFE CYCLE HOOKS INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    bindCoreFunctionalInteractions();
    renderActiveScreenLayout();
});

function bindCoreFunctionalInteractions() {
    // Auth Interactions
    document.getElementById("btn-login").addEventListener("click", processAuthenticationHandshake);
    
    // Role Selective Reactive Elements
    document.querySelectorAll('input[name="auth-role"]').forEach(elem => {
        elem.addEventListener("change", (e) => {
            const currentRoleSelection = e.target.value;
            if (currentRoleSelection === "student") {
                document.getElementById("onboard-student-fields").classList.remove("hidden");
                document.getElementById("onboard-business-fields").classList.add("hidden");
            } else {
                document.getElementById("onboard-student-fields").classList.add("hidden");
                document.getElementById("onboard-business-fields").classList.remove("hidden");
            }
        });
    });

    // Save Onboarding Data Action
    document.getElementById("btn-save-onboard").addEventListener("click", processOnboardingFormSubmission);

    // Dashboard Engine Control Anchors
    document.getElementById("toggle-mode-btn").addEventListener("click", toggleDashboardWorkingRoleMode);
    document.getElementById("action-left").addEventListener("click", () => triggerManualPhysicsSwipeEvent("left"));
    document.getElementById("action-right").addEventListener("click", () => triggerManualPhysicsSwipeEvent("right"));

    // Modal Control Sets
    document.getElementById("btn-close-match").addEventListener("click", closeActiveMatchOverlayModal);
    document.getElementById("btn-send-message").addEventListener("click", dispatchInstantChatMessagePipeline);
    document.getElementById("chat-input-field").addEventListener("keypress", (e) => { if (e.key === 'Enter') dispatchInstantChatMessagePipeline(); });
}

// 5. VIEW PORT ROUTER STATE SWITCHER
function renderActiveScreenLayout() {
    document.getElementById("screen-auth").classList.add("hidden");
    document.getElementById("screen-onboarding").classList.add("hidden");
    document.getElementById("screen-dashboard").classList.add("hidden");

    if (!appState.profile.full_name) {
        document.getElementById("screen-auth").classList.remove("hidden");
    } else if (appState.profile.full_name && !appState.profile.location) {
        document.getElementById("screen-onboarding").classList.remove("hidden");
    } else {
        document.getElementById("screen-dashboard").classList.remove("hidden");
        syncDashboardMetadataInterfaceElements();
        compileTargetMarketplaceDataDeck();
    }
}

// 6. PIPELINE CONTROLLER: REGISTRATION ENTRY POINT
async function processAuthenticationHandshake() {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const selectedRole = document.querySelector('input[name="auth-role"]:checked').value;

    appState.profile.role_type = selectedRole;

    if (supabase) {
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (!error && data.user) appState.profile.id = data.user.id;
        } catch (err) { console.warn("Supabase context offline. Running under Sandbox Layer."); }
    }

    // Advance viewport forward seamlessly without browser hard-reload execution routines
    document.getElementById("screen-auth").classList.add("hidden");
    document.getElementById("screen-onboarding").classList.remove("hidden");
}

// 7. PIPELINE CONTROLLER: DATA PERSISTENCE PIPELINE
async function processOnboardingFormSubmission() {
    const nameInput = document.getElementById("onboard-name").value.trim();
    const locationInput = document.getElementById("onboard-location").value;

    if (!nameInput) {
        alert("Please state your professional credentials to continue.");
        return;
    }

    appState.profile.full_name = nameInput;
    appState.profile.location = locationInput;

    if (appState.profile.role_type === "student") {
        appState.profile.college_name = document.getElementById("onboard-college").value;
    } else {
        appState.profile.company_name = nameInput;
        appState.profile.biz_type = document.getElementById("onboard-biztype").value || "Micro Ventures Shop";
    }

    if (supabase) {
        try {
            await supabase.from('profiles').upsert({
                id: appState.profile.id,
                full_name: appState.profile.full_name,
                role_type: appState.profile.role_type,
                college_name: appState.profile.college_name || null,
                company_name: appState.profile.company_name || null,
                location: appState.profile.location,
                rating: appState.profile.rating,
                xp_points: appState.profile.xp_points
            });
        } catch (e) { console.error("Database upsert failed."); }
    }

    renderActiveScreenLayout();
}

// 8. DASHBOARD RE-SYNCHRONIZATION ENGINES
function toggleDashboardWorkingRoleMode() {
    appState.profile.role_type = (appState.profile.role_type === "student") ? "business" : "student";
    document.getElementById("toggle-mode-btn").innerText = (appState.profile.role_type === "student") ? "Work Mode" : "Hire Mode";
    
    syncDashboardMetadataInterfaceElements();
    compileTargetMarketplaceDataDeck();
}

function syncDashboardMetadataInterfaceElements() {
    document.getElementById("dash-user-name").innerText = appState.profile.full_name;
    document.getElementById("user-avatar-initial").innerText = appState.profile.full_name.charAt(0).toUpperCase();

    const contextualMetaString = (appState.profile.role_type === "student")
        ? `${appState.profile.college_name || "Kolkata Student"}`
        : `${appState.profile.location} Hub Owner`;

    document.getElementById("dash-user-meta").innerText = `${contextualMetaString} • ${appState.profile.rating}★`;
    document.getElementById("dash-xp-display").innerText = `${appState.profile.xp_points} XP`;

    // Process RPG Achievements Tree Mapping logic variables
    const badgesLayer = document.getElementById("dash-badge-strip");
    badgesLayer.innerHTML = "";
    
    let logicalBadgesArr = [];
    if (appState.profile.xp_points >= 200) {
        logicalBadgesArr = (appState.profile.role_type === "student") ? ["👑 Elite Gigger", "⚡ Pro"] : ["🔥 Top Paymaster"];
    } else {
        logicalBadgesArr = ["📈 Rising Tier"];
    }

    logicalBadgesArr.forEach(badgeTitle => {
        const spanBadge = document.createElement("span");
        spanBadge.className = "bg-indigo-950 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-black text-[9px] tracking-wider uppercase animate-pulse";
        spanBadge.innerText = badgeTitle;
        badgesLayer.appendChild(spanBadge);
    });
}

// 9. DYNAMIC CARD COMPILATION ALGORITHM
function compileTargetMarketplaceDataDeck() {
    const arenaDeck = document.getElementById("card-deck-container");
    arenaDeck.innerHTML = "";
    appState.currentCardIndex = 0;

    appState.activeDeckCards = (appState.profile.role_type === "student") ? [...KOLKATA_MOCK_GIGS] : [...KOLKATA_MOCK_STUDENTS];

    if (appState.activeDeckCards.length === 0) {
        arenaDeck.innerHTML = `<div class="text-xs text-slate-500 font-bold">No data assets match your sector telemetry vectors.</div>`;
        return;
    }

    appState.activeDeckCards.forEach((item, idx) => {
        const visualCard = document.createElement("div");
        visualCard.id = `card-element-${idx}`;
        visualCard.className = "absolute w-full max-w-[320px] h-[430px] swipe-card glass-card rounded-2xl p-5 flex flex-col justify-between transition-transform pointer-events-auto select-none shadow-xl";
        
        // Multi layered isometric structural offsets calculations
        visualCard.style.zIndex = appState.activeDeckCards.length - idx;
        visualCard.style.transform = `scale(${1 - idx * 0.035}) translateY(${idx * 14}px)`;

        let structureHTML = "";
        if (appState.profile.role_type === "student") {
            structureHTML = `
                <div class="space-y-4">
                    <div class="flex justify-between items-start">
                        <span class="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded">📍 ${item.location}</span>
                        ${item.is_sos ? `<span class="bg-red-950 text-red-500 border border-red-500 font-black text-[9px] px-2 py-0.5 rounded animate-sos-neon">🚨 SOS: 1.5x SURGE</span>` : ''}
                    </div>
                    <div>
                        <h4 class="text-lg font-black text-white leading-tight">${item.title}</h4>
                        <p class="text-xs font-bold text-indigo-400/90 mt-0.5">${item.business_name}</p>
                    </div>
                    <div class="bg-slate-950/40 border border-slate-800 rounded-xl p-3 space-y-1 text-[11px]">
                        <div class="flex justify-between text-slate-400"><span>Timings Window:</span><span class="text-slate-200 font-bold">${item.timing}</span></div>
                        <div class="flex justify-between text-slate-400"><span>Trust Metric:</span><span class="text-amber-400 font-bold">★ ${item.rating}</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hourly Payout Guaranteed</span>
                    <span class="text-2xl font-black font-mono text-emerald-400">₹${item.payout_amount}<span class="text-xs text-slate-500">/hr</span></span>
                </div>
            `;
        } else {
            let skillsStringList = item.skills.map(sk => `<span class="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-bold">${sk}</span>`).join('');
            structureHTML = `
                <div class="space-y-4">
                    <div class="flex justify-between items-start">
                        <span class="bg-purple-600/20 text-purple-400 border border-purple-500/20 text-[9px] font-black px-2 py-0.5 rounded uppercase">🎓 ${item.college_name}</span>
                        <span class="text-amber-400 text-[10px] font-bold">🛡️ ${item.xp_points} XP</span>
                    </div>
                    <div>
                        <h4 class="text-lg font-black text-white leading-tight">${item.full_name}</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5">Target Operations Hub: <span class="text-slate-200 font-bold">${item.location}</span></p>
                    </div>
                    <div class="space-y-1.5">
                        <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Verified Talent Framework Matrix</span>
                        <div class="flex flex-wrap gap-1.5">${skillsStringList}</div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span class="text-[10px] uppercase text-slate-500 font-bold">Reputation Integrity Score</span>
                    <span class="text-base font-black text-slate-200 font-mono">★ ${item.rating} / 5.0</span>
                </div>
            `;
        }

        visualCard.innerHTML = structureHTML;
        arenaDeck.appendChild(visualCard);
        injectPhysicsGestureControlsToCard(visualCard, idx);
    });
}

// 10. PHYSICS TOUCH & MOUSE ACCELERATED GESTURES HANDLER
function injectPhysicsGestureControlsToCard(cardDOM, loopIndex) {
    let initialX = 0;
    let horizontalDeltaX = 0;
    let dragTrackFlag = false;

    cardDOM.addEventListener("mousedown", triggerDragSequenceStart);
    cardDOM.addEventListener("touchstart", triggerDragSequenceStart, { passive: true });

    function triggerDragSequenceStart(e) {
        if (loopIndex !== appState.currentCardIndex) return;
        dragTrackFlag = true;
        initialX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        cardDOM.style.transition = "none";

        document.addEventListener("mousemove", processPointerMovementCalculations);
        document.addEventListener("touchmove", processPointerMovementCalculations, { passive: false });
        document.addEventListener("mouseup", terminateDragGesturePipeline);
        document.addEventListener("touchend", terminateDragGesturePipeline);
    }

    function processPointerMovementCalculations(e) {
        if (!dragTrackFlag) return;
        if (e.type === "touchmove") e.preventDefault(); // Suspend peripheral standard window scrolling gestures instantly

        const runningClientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        horizontalDeltaX = runningClientX - initialX;

        const dynamicAngularRotation = horizontalDeltaX / 16;
        cardDOM.style.transform = `translateX(${horizontalDeltaX}px) rotate(${dynamicAngularRotation}deg) scale(1.02)`;

        if (horizontalDeltaX > 50) {
            cardDOM.style.borderColor = "rgba(99, 102, 241, 0.5)"; // Blue tint overlay border signal
        } else if (horizontalDeltaX < -50) {
            cardDOM.style.borderColor = "rgba(239, 68, 68, 0.5)";  // Red tint overlay border signal
        } else {
            cardDOM.style.borderColor = "rgba(255, 255, 255, 0.12)";
        }
    }

    function terminateDragGesturePipeline() {
        dragTrackFlag = false;
        document.removeEventListener("mousemove", processPointerMovementCalculations);
        document.removeEventListener("touchmove", processPointerMovementCalculations);
        document.removeEventListener("mouseup", terminateDragGesturePipeline);
        document.removeEventListener("touchend", terminateDragGesturePipeline);

        cardDOM.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease";
        
        const strictExecutionSwipeBoundary = 130;
        if (horizontalDeltaX > strictExecutionSwipeBoundary) {
            finalizeCardExitDisplacement(cardDOM, "right");
        } else if (horizontalDeltaX < -strictExecutionSwipeBoundary) {
            finalizeCardExitDisplacement(cardDOM, "left");
        } else {
            cardDOM.style.transform = `scale(1) translateY(0px) translateX(0px) rotate(0deg)`;
            cardDOM.style.borderColor = "rgba(255, 255, 255, 0.12)";
        }
        horizontalDeltaX = 0;
    }
}

// 11. VISUAL SWIPE COMPLETION TRIGGERS
function triggerManualPhysicsSwipeEvent(direction) {
    const targetedActiveCard = document.getElementById(`card-element-${appState.currentCardIndex}`);
    if (targetedActiveCard) {
        targetedActiveCard.style.transition = "transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.3s ease";
        finalizeCardExitDisplacement(targetedActiveCard, direction);
    }
}

function finalizeCardExitDisplacement(cardDOM, direction) {
    const finalTranslationValue = (direction === "right") ? 500 : -500;
    const finalRotationValue = (direction === "right") ? 30 : -30;

    cardDOM.style.transform = `translateX(${finalTranslationValue}px) rotate(${finalRotationValue}deg)`;
    cardDOM.style.opacity = "0";
    cardDOM.style.pointerEvents = "none";

    commitInteractionLogToDatabaseTelemetry(direction);
}

// 12. SWIPE INTERACTION PIPELINE HANDLING WITH PROBABILISTIC MATCH INTERCEPTS
async function commitInteractionLogToDatabaseTelemetry(direction) {
    const selectedItemNodeObj = appState.activeDeckCards[appState.currentCardIndex];

    if (supabase) {
        try {
            await supabase.from('swipes').insert({
                swiper_id: appState.profile.id,
                target_id: selectedItemNodeObj.id,
                direction: direction,
                type: (appState.profile.role_type === "student") ? "job" : "applicant"
            });
        } catch (e) {}
    }

    // RPG XP Engine Progression Increment rules mappings
    if (direction === "right") {
        appState.profile.xp_points += 30;
        syncDashboardMetadataInterfaceElements();
    }

    // INTERCEPT RULES: Right swipes on index 0, 2, 4 trigger immediate feedback matches loops
    if (direction === "right" && appState.currentCardIndex % 2 === 0) {
        setTimeout(() => { triggerImmersiveMatchCelebrationOverlay(selectedItemNodeObj); }, 400);
    }

    appState.currentCardIndex++;
    executeBackgroundLayerStackAdjustments();
}

function executeBackgroundLayerStackAdjustments() {
    for (let i = appState.currentCardIndex; i < appState.activeDeckCards.length; i++) {
        const structuralCardDOM = document.getElementById(`card-element-${i}`);
        if (structuralCardDOM) {
         
