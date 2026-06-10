
const accountListings = [
  { id:1, title:'Apex Predator Account – Top 200 NA', rank:'predator', rankLabel:'Predator', rankIcon:'🔴', level:600, kd:7.2, kills:45000, price:249.99, rating:5.0, reviews:23, seller:'ProSeller', si:'PS', delivery:'Instant', features:['og','battlepass','level500','fullmail'], desc:'Top 200 NA Predator account. Heirloom shard ready, all OG skins, 45k kills. Verified and safe transfer.', badge:'HOT', badgeClass:'badge-hot' },
  { id:2, title:'Master Account – OG Wraith Heirloom', rank:'master', rankLabel:'Master', rankIcon:'👑', level:500, kd:4.8, kills:28000, price:149.99, rating:4.9, reviews:41, seller:'LegendStore', si:'LS', delivery:'Instant', features:['og','level500','fullmail'], desc:'Master rank account with Wraith heirloom, OG skins and all season battle passes.', badge:'Master', badgeClass:'badge-master' },
  { id:3, title:'Diamond Smurf – 3KD+ Fresh Ranked', rank:'diamond', rankLabel:'Diamond', rankIcon:'💠', level:200, kd:3.5, kills:12000, price:59.99, rating:4.7, reviews:88, seller:'SmurfKing', si:'SK', delivery:'Instant', features:['fullmail'], desc:'Clean Diamond smurf. Perfect for new season ranked push. Full email access included.', badge:'Diamond', badgeClass:'badge-diamond' },
  { id:4, title:'Master Account – All Heirlooms Unlocked', rank:'master', rankLabel:'Master', rankIcon:'👑', level:800, kd:5.1, kills:38000, price:399.99, rating:5.0, reviews:14, seller:'EliteGear', si:'EG', delivery:'Instant', features:['og','battlepass','level500','fullmail'], desc:'Ultra rare account with ALL 3 heirlooms. OG Bloodhound, Wraith, Octane. Complete collection.', badge:'New', badgeClass:'badge-new' },
  { id:5, title:'Platinum Smurf – Great for Ranked Grind', rank:'platinum', rankLabel:'Platinum', rankIcon:'💎', level:150, kd:2.9, kills:8000, price:34.99, rating:4.6, reviews:156, seller:'QuickSell', si:'QS', delivery:'Instant', features:['fullmail'], desc:'Fresh Platinum account perfect for unranked. 2.9 KD ratio, ready for ranked push.', badge:'Platinum', badgeClass:'badge-platinum' },
  { id:6, title:'Gold Account – Collector Edition Skins', rank:'gold', rankLabel:'Gold', rankIcon:'🥇', level:300, kd:2.2, kills:15000, price:44.99, rating:4.8, reviews:67, seller:'SkinVault', si:'SV', delivery:'Instant', features:['battlepass','fullmail'], desc:'Gold account with collector edition skins not available in store. Multiple legendary bundles.', badge:'Gold', badgeClass:'badge-gold-rank' },
  { id:7, title:'Diamond 1 | Sky Piercer Universal Heirloom | Level 508 | 195 Legendries | Reactive Skins | Steam + EA', rank:'diamond', rankLabel:'Diamond 1', rankIcon:'💠', level:508, price:299.00, rating:5.0, reviews:0, seller:'EldoradoSeller', si:'ES', delivery:'Instant', features:['level500', 'fullmail', 'battlepass', 'og'], desc:'Sky Piercer Universal Heirloom\\nLevel 508\\n195 Legendries\\n\\nFlatline Reactive Skin - 1 (Overheat)\\nP2020 Reactive Skin - 1\\nAlternator Reactive Skin - 1\\nNemesis Reactive Skin - 1\\n30-30 Reactive Skins - 2\\nBocek Reactive Skin - 1 (S28 BP)\\n\\nS21 BP MAX\\nS22 BP MAX\\nS24 Both Split BP MAX\\nS25 BP MAX\\nS28 Both Split BP MAX', badge:'Premium', badgeClass:'badge-hot' },
  { id:8, title:'Gibraltor Heirloom | Masters Animated Badge | Brudda Bear | Ranked Ladder Champ | 210 Legendries | 554 Level | EA + STEAM', rank:'master', rankLabel:'Master', rankIcon:'👑', level:554, price:270.00, rating:5.0, reviews:0, seller:'EldoradoSeller', si:'ES', delivery:'Instant', features:['level500', 'fullmail', 'battlepass', 'og'], desc:'550+ Level\\n7000+ Career Kills\\n1.56 K/DR\\n210 Legendries\\nGibraltor Heirloom\\n\\nRanked Ladder Champion Dive Trail (Usable For Ranked Season 29 Split 1)\\n\\nS15 BP MAX\\nS16 BP MAX\\nS17 BP MAX\\nS18 BP MAX\\nS19 BP MAX\\n\\nSeason 17 Masters Rank Animated Badge\\n\\nMastiff 2 Reactive Skins\\nEva-8 2 Reactive Skins\\nCharge Rifle 2 Reactive Skins\\nRampage 2 Reactive Skins\\nC.A.R 2 Reactive Skins\\n\\nR-99 Reactive Skin\\n\\nBrudda Bear Skin Gibraltor\\nStarlightspeed Octane Skin\\nAnicent Of The Void Wraith Skin', badge:'Premium', badgeClass:'badge-master' },
];

let filteredAccounts = [...accountListings];

function renderAccounts(accounts) {
  const grid = document.getElementById('accountsGrid');
  document.getElementById('resultsCount').textContent = `Showing ${accounts.length} account${accounts.length !== 1 ? 's' : ''}`;
  if (accounts.length === 0) {
    grid.innerHTML = '<div style="text-align:center; padding:60px; color:var(--text-muted); grid-column:1/-1;"><div style="font-size:48px; margin-bottom:16px;">😔</div><div style="font-size:18px;">No accounts match your filters</div><div style="font-size:14px; margin-top:8px;">Try adjusting your filters or search</div></div>';
    return;
  }
  grid.innerHTML = accounts.map(acc => `
    <div class="offer-card" onclick="openAccountModal(${acc.id})">
      <div class="offer-card-img" style="background:linear-gradient(135deg,#1a1030,#0a0a1f);">
        <div style="display:flex; align-items:center; justify-content:center; height:100%; font-size:64px;">${acc.rankIcon}</div>
        <div class="offer-card-badge ${acc.badgeClass}">${acc.badge}</div>
      </div>
      <div class="offer-card-body">
        <div class="offer-seller">
          <div class="seller-avatar">${acc.si}</div>
          <span class="seller-name">${acc.seller}</span>
          <span class="seller-verified" title="Verified">✓</span>
        </div>
        <h3 class="offer-title">${acc.title}</h3>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:10px;">
          <span style="font-size:12px; color:var(--text-muted);">Lv.${acc.level}</span>
          ${acc.kd ? \`<span style="font-size:12px; color:var(--text-muted);">🎯 ${acc.kd} K/D</span>\` : ''}
          ${acc.kills ? \`<span style="font-size:12px; color:var(--text-muted);">💀 ${acc.kills.toLocaleString()} kills</span>\` : ''}
        </div>
        <div class="offer-meta">
          <span class="offer-rating">★ ${acc.rating}</span>
          <span>(${acc.reviews})</span>
          <span>• ${acc.delivery}</span>
        </div>
        <div class="offer-footer">
          <div>
            <div class="offer-price">$${acc.price}</div>
            <div class="offer-price-sub">Full account</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); buyAccount(${acc.id})">Buy Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openAccountModal(id) {
  const acc = accountListings.find(a => a.id === id);
  document.getElementById('modalAccountTitle').textContent = acc.title;
  document.getElementById('modalAccountBody').innerHTML = `
    <div style="text-align:center; font-size:72px; margin-bottom:16px;">${acc.rankIcon}</div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:20px;">
      <div style="background:var(--bg-surface); border-radius:var(--radius-md); padding:12px; text-align:center;">
        <div style="font-size:20px; font-weight:700; color:var(--apex-red);">${acc.level}</div>
        <div style="font-size:11px; color:var(--text-muted);">Level</div>
      </div>
      <div style="background:var(--bg-surface); border-radius:var(--radius-md); padding:12px; text-align:center; ${!acc.kd ? 'opacity:0.3;' : ''}">
        <div style="font-size:20px; font-weight:700; color:var(--apex-red);">${acc.kd || 'N/A'}</div>
        <div style="font-size:11px; color:var(--text-muted);">K/D Ratio</div>
      </div>
      <div style="background:var(--bg-surface); border-radius:var(--radius-md); padding:12px; text-align:center; ${!acc.kills ? 'opacity:0.3;' : ''}">
        <div style="font-size:20px; font-weight:700; color:var(--apex-red);">${acc.kills ? (acc.kills/1000).toFixed(1)+'k' : 'N/A'}</div>
        <div style="font-size:11px; color:var(--text-muted);">Total Kills</div>
      </div>
    </div>
    <p style="font-size:14px; color:var(--text-secondary); line-height:1.7; margin-bottom:16px; white-space:pre-wrap;">${acc.desc}</p>
    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Included Features</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${acc.features.map(f => ({og:'OG Skins 🎨',battlepass:'All Battle Passes 🎫',level500:'Level 500+ 💪',fullmail:'Full Email Access 📧'})[f] || f).map(f => `<span style="background:rgba(0,212,255,0.08); border:1px solid rgba(0,212,255,0.2); color:var(--neon-blue); padding:4px 12px; border-radius:4px; font-size:12px; font-weight:600;">${f}</span>`).join('')}
      </div>
    </div>
    <div style="background:var(--bg-surface); border-radius:var(--radius-lg); padding:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
      <div>
        <div style="font-size:12px; color:var(--text-muted);">Price</div>
        <div style="font-family:'Orbitron',monospace; font-size:28px; font-weight:700; color:var(--apex-red);">$${acc.price}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px; color:var(--text-muted);">Delivery</div>
        <div style="font-weight:700; color:#00ff64;">⚡ ${acc.delivery}</div>
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%; padding:14px;" onclick="buyAccount(${acc.id}); closeModal('accountModal');">
      <i class="fas fa-lock"></i> Buy Securely – $${acc.price}
    </button>
  `;
  openModal('accountModal');
}

function buyAccount(id) {
  const user = getUser();
  if (!user) { showToast('Please sign in to purchase!', 'info'); setTimeout(()=>window.location.href='login.html',1200); return; }
  const acc = accountListings.find(a => a.id === id);
  placeOrder({ type:'accounts', title:acc.title, price:acc.price, seller:acc.seller });
  setTimeout(() => window.location.href = 'dashboard.html', 1500);
}

function applyFilters() {
  const search = document.getElementById('accountSearch')?.value.toLowerCase() || '';
  const checkedRanks = [...document.querySelectorAll('.sidebar-filter input[type=checkbox][value]')].filter(c=>c.checked && ['predator','master','diamond','platinum','gold'].includes(c.value)).map(c=>c.value);
  const checkedFeatures = [...document.querySelectorAll('.sidebar-filter input[type=checkbox]')].filter(c=>c.checked && ['og','battlepass','level500','fullmail'].includes(c.value)).map(c=>c.value);
  const minP = parseFloat(document.getElementById('minPrice')?.value) || 0;
  const maxP = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
  const sort = document.getElementById('accountSort')?.value || 'featured';

  let result = accountListings.filter(acc => {
    if (search && !acc.title.toLowerCase().includes(search)) return false;
    if (checkedRanks.length && !checkedRanks.includes(acc.rank)) return false;
    if (checkedFeatures.length && !checkedFeatures.every(f => acc.features.includes(f))) return false;
    if (acc.price < minP || acc.price > maxP) return false;
    return true;
  });

  if (sort === 'price-low') result.sort((a,b) => a.price - b.price);
  else if (sort === 'price-high') result.sort((a,b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a,b) => b.rating - a.rating);

  renderAccounts(result);
}

function filterByRank(rank) {
  filteredAccounts = accountListings.filter(a => a.rank === rank || rank === 'og');
  renderAccounts(filteredAccounts);
}

function clearFilters() {
  document.querySelectorAll('.sidebar-filter input[type=checkbox]').forEach(c => c.checked = false);
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('accountSearch').value = '';
  renderAccounts(accountListings);
}

renderAccounts(accountListings);
