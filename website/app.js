// ==========================================
// NAVIPEX - APEX LEGENDS MARKETPLACE
// Main JavaScript Application
// ==========================================

// ==========================================
// USER AUTH STATE
// ==========================================

const OWNER_CREDENTIALS = {
  username: 'NaviOwner',
  email: 'owner@navipex.gg',
  password: 'NaviApex2026!',
  role: 'owner',
  initials: 'NO',
  joinDate: '2026-01-01'
};

function getUser() {
  return JSON.parse(localStorage.getItem('navipex_user') || 'null');
}

function setUser(user) {
  localStorage.setItem('navipex_user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('navipex_user');
  showToast('Signed out successfully. See you soon! 👋', 'info');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

// ==========================================
// NAVBAR DYNAMIC RENDERING
// ==========================================

function renderNav() {
  const user = getUser();
  const actionsEl = document.getElementById('navActions');
  if (!actionsEl) return;

  if (user) {
    const isOwner = user.role === 'owner';
    actionsEl.innerHTML = `
      <div class="nav-user-menu">
        <div class="user-avatar-btn" onclick="toggleDropdown()">
          <div class="user-avatar" style="${isOwner ? 'background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000;' : ''}">${user.initials || user.username.slice(0,2).toUpperCase()}</div>
          <span style="font-size:14px; font-weight:600;">${user.username}</span>
          ${isOwner ? '<span style="color: var(--apex-gold); font-size:12px;">👑</span>' : ''}
          <i class="fas fa-chevron-down" style="font-size:10px; color:var(--text-muted)"></i>
        </div>
        <div class="user-dropdown" id="userDropdown">
          ${isOwner ? `<div class="dropdown-item owner-badge"><i class="fas fa-crown"></i> Owner Panel <a href="dashboard.html" style="margin-left:auto; font-size:11px; color: var(--apex-gold);">Open →</a></div><div class="dropdown-divider"></div>` : ''}
          <a href="dashboard.html" class="dropdown-item"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
          <a href="dashboard.html#orders" class="dropdown-item"><i class="fas fa-box"></i> My Orders</a>
          <a href="sell.html" class="dropdown-item"><i class="fas fa-tags"></i> My Listings</a>
          <a href="dashboard.html#settings" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" onclick="logout()" style="color: var(--apex-red); cursor:pointer;">
            <i class="fas fa-sign-out-alt"></i> Sign Out
          </div>
        </div>
      </div>
    `;
  } else {
    actionsEl.innerHTML = `
      <a href="login.html" class="btn btn-ghost btn-sm">Sign In</a>
      <a href="signup.html" class="btn btn-primary btn-sm">
        <i class="fas fa-rocket"></i> Get Started
      </a>
    `;
  }
}

function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.querySelector('.nav-user-menu');
  const dropdown = document.getElementById('userDropdown');
  if (dropdown && menu && !menu.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

// ==========================================
// MOBILE NAV
// ==========================================

function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  if (nav) {
    nav.classList.toggle('active');
    if (nav.classList.contains('active')) {
      hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      hamburger.children[1].style.opacity = '0';
      hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      hamburger.children[0].style.transform = '';
      hamburger.children[1].style.opacity = '';
      hamburger.children[2].style.transform = '';
    }
  }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: '💬', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ==========================================
// PARTICLE SYSTEM
// ==========================================

function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 3 + 1;
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 5}s;
      background: ${Math.random() > 0.5 ? 'var(--apex-red)' : 'var(--apex-orange)'};
    `;
    container.appendChild(particle);
  }
}

// ==========================================
// COUNTER ANIMATION
// ==========================================

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || (target === 99 ? '%' : '+');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current).toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ==========================================
// SCROLL EFFECTS
// ==========================================

window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 2px 30px rgba(0,0,0,0.9)';
    } else {
      nav.style.boxShadow = 'var(--shadow-nav)';
    }
  }
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card, .trust-card, .step-item, .testimonial-card, .offer-card, .coach-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ==========================================
// ORDER MANAGEMENT
// ==========================================

function getOrders() {
  return JSON.parse(localStorage.getItem('navipex_orders') || '[]');
}

function addOrder(order) {
  const orders = getOrders();
  order.id = 'ORD-' + Date.now();
  order.date = new Date().toISOString();
  order.status = 'pending';
  orders.unshift(order);
  localStorage.setItem('navipex_orders', JSON.stringify(orders));
  return order;
}

function placeOrder(serviceData) {
  const user = getUser();
  if (!user) {
    showToast('Please sign in to place an order!', 'error');
    setTimeout(() => window.location.href = 'login.html', 1200);
    return;
  }
  const order = addOrder({ ...serviceData, buyer: user.username });
  showToast(`Order ${order.id} placed successfully! 🚀`, 'success');
  return order;
}

// ==========================================
// LISTINGS MANAGEMENT
// ==========================================

function getListings() {
  let listings = JSON.parse(localStorage.getItem('navipex_listings') || 'null');
  if (!listings) {
    listings = [
      { id: 'LST-1', type: 'accounts', title: 'Diamond 1 | Sky Piercer Universal Heirloom...', price: 299.00, status: 'active', seller: 'NaviOwner', date: new Date().toISOString() },
      { id: 'LST-2', type: 'accounts', title: 'Gibraltor Heirloom | Masters Animated Badge...', price: 270.00, status: 'active', seller: 'NaviOwner', date: new Date().toISOString() },
      { id: 'LST-3', type: 'boosting', title: 'Rank Boosting Service', price: 19.99, status: 'active', seller: 'NaviOwner', date: new Date().toISOString() },
      { id: 'LST-4', type: 'coaching', title: '1-on-1 Pro Coaching', price: 24.99, status: 'active', seller: 'NaviOwner', date: new Date().toISOString() }
    ];
    localStorage.setItem('navipex_listings', JSON.stringify(listings));
  }
  return listings;
}

function addListing(listing) {
  const listings = getListings();
  listing.id = 'LST-' + Date.now();
  listing.date = new Date().toISOString();
  listing.status = 'pending'; // Needs admin approval
  listing.seller = getUser()?.username;
  listings.unshift(listing);
  localStorage.setItem('navipex_listings', JSON.stringify(listings));
  return listing;
}

// ==========================================
// USERS MANAGEMENT
// ==========================================

function getToken() {
  return localStorage.getItem('navipex_token');
}

async function registerUser(data) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error };
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Server connection failed.' };
  }
}

async function loginUser(emailOrUsername, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: emailOrUsername, password })
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error };
    
    localStorage.setItem('navipex_token', result.token);
    setUser(result.user);
    return { success: true, user: result.user };
  } catch (err) {
    return { success: false, error: 'Server connection failed.' };
  }
}

// ==========================================
// MESSAGES MANAGEMENT
// ==========================================

async function getConversationsAPI() {
  try {
    const res = await fetch('/api/messages/conversations', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) { return []; }
}

async function getChatHistoryAPI(orderId) {
  try {
    const res = await fetch(`/api/messages/${orderId}`, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) { return []; }
}

async function sendMessageAPI(orderId, content) {
  try {
    const res = await fetch(`/api/messages/${orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
      body: JSON.stringify({ content })
    });
    return res.ok;
  } catch (err) { return false; }
}

// ==========================================
// FORM VALIDATION
// ==========================================

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pass) {
  return pass.length >= 8;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'var(--apex-red)';
  let err = field.parentElement.querySelector('.form-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'form-error';
    field.parentElement.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '';
  const err = field.parentElement.querySelector('.form-error');
  if (err) err.remove();
}

// ==========================================
// MODAL HELPERS
// ==========================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

// ==========================================
// FLOATING SUPPORT WIDGET
// ==========================================

function renderFloatingSupport() {
  const user = getUser();
  // Only show for logged in non-owner users
  if (!user || user.role === 'owner') return;

  const html = `
    <div id="floatingSupportBtn" onclick="toggleSupportWindow()">
      <i class="fas fa-comment-dots"></i>
      <div class="badge" id="supportUnreadBadge" style="display:none;">!</div>
    </div>
    
    <div id="floatingSupportWindow">
      <div class="support-header">
        <div>
          <div style="font-weight:800; font-size:14px;"><i class="fas fa-headset"></i> NaviApex Support</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.7);">We typically reply in a few minutes</div>
        </div>
        <i class="fas fa-times" style="cursor:pointer;" onclick="toggleSupportWindow()"></i>
      </div>
      <div class="support-messages" id="supportMessages">
        <div style="text-align:center; color:var(--text-muted); font-size:12px; margin-top:20px;">
          <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
      <div class="support-input-area">
        <input type="text" id="supportInput" placeholder="Type your message..." style="flex:1; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:14px; padding:10px 14px; color:var(--text-primary); font-size:13px;" onkeydown="if(event.key==='Enter') sendSupportMessage()">
        <button class="btn btn-primary" style="padding:10px 14px; border-radius:14px;" onclick="sendSupportMessage()"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  loadSupportMessages();
}

let supportChatInterval = null;
let lastSupportMessageCount = 0;

function toggleSupportWindow() {
  const win = document.getElementById('floatingSupportWindow');
  win.classList.toggle('active');
  if (win.classList.contains('active')) {
    loadSupportMessages(true);
    document.getElementById('supportUnreadBadge').style.display = 'none';
    supportChatInterval = setInterval(() => loadSupportMessages(false), 3000);
  } else {
    if (supportChatInterval) clearInterval(supportChatInterval);
  }
}

async function loadSupportMessages(forceScroll = false) {
  const user = getUser();
  if (!user) return;
  const supportId = 'support_' + user.username;
  const messages = await getChatHistoryAPI(supportId);
  const container = document.getElementById('supportMessages');
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:flex-start; margin-bottom:8px;">
        <div style="font-size:10px; color:var(--text-muted); margin-bottom:2px; padding:0 4px;">NaviOwner 👑</div>
        <div style="max-width:85%; background:rgba(255,215,0,0.1); border:1px solid var(--apex-gold); border-radius:14px 14px 14px 4px; padding:10px 14px; font-size:13px; color:var(--apex-gold); line-height:1.4;">
          Welcome to NaviApex Support! How can we help you today?
        </div>
      </div>
    `;
    return;
  }

  const newHtml = messages.map(m => {
    const isMe = m.sender_username === user.username;
    const isOwner = m.sender_username === 'NaviOwner';
    const bg = isMe ? 'var(--gradient-button)' : (isOwner ? 'rgba(255,215,0,0.1)' : 'var(--bg-surface)');
    const border = isMe ? 'none' : (isOwner ? '1px solid var(--apex-gold)' : '1px solid var(--border-color)');
    const color = isMe ? '#fff' : (isOwner ? 'var(--apex-gold)' : 'var(--text-primary)');
    const radius = isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px';
    
    return `
      <div style="display:flex; flex-direction:column; align-items:${isMe ? 'flex-end' : 'flex-start'}; margin-bottom:8px;">
        <div style="font-size:10px; color:var(--text-muted); margin-bottom:2px; padding:0 4px;">
          ${m.sender_username} ${isOwner ? '👑' : ''} • ${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        <div style="max-width:85%; background:${bg}; border:${border}; border-radius:${radius}; padding:10px 14px; font-size:13px; color:${color}; line-height:1.4; word-wrap:break-word;">
          ${m.content}
        </div>
      </div>
    `;
  }).join('');
  
  // Only update DOM if things changed to prevent flickering
  if (container.innerHTML !== newHtml) {
    container.innerHTML = newHtml;
  }
  
  if (forceScroll || messages.length > lastSupportMessageCount) {
    container.scrollTop = container.scrollHeight;
    lastSupportMessageCount = messages.length;
  }
}

async function sendSupportMessage() {
  const user = getUser();
  if (!user) return;
  const input = document.getElementById('supportInput');
  const text = input.value.trim();
  if (!text) return;

  const btn = input.nextElementSibling;
  input.disabled = true;
  btn.disabled = true;

  const supportId = 'support_' + user.username;
  const success = await sendMessageAPI(supportId, text);

  input.disabled = false;
  btn.disabled = false;

  if (success) {
    input.value = '';
    loadSupportMessages(true);
  } else {
    showToast('Failed to send message', 'error');
  }
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  createParticles();
  animateCounters();
  setTimeout(initAnimations, 100);
  renderFloatingSupport();

  // Initialize owner in storage
  getUsers();
});
