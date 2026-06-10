// ==========================================
// NAVIPEX - PAYPAL PAYMENT INTEGRATION
// ==========================================

// ---- CONFIGURATION ----
// REPLACE THIS WITH YOUR REAL PAYPAL CLIENT ID WHEN GOING LIVE
// For sandbox testing, use: AcDm3M_example_sandbox_id
// Get your live Client ID from: https://developer.paypal.com/apps
const PAYPAL_CLIENT_ID = 'AU_11w8NNPGVFGA4X-eyxl2Anaokw8Z1XsvvmULGS6B-Exl4hVSKoOuUVaIdbiCKtFaYRm_BAA6ujOjo'; // LIVE MODE
const PAYPAL_CURRENCY = 'USD';
const PLATFORM_FEE_PERCENT = 8; // NaviApex takes 8%

// ---- LOAD PAYPAL SDK ----
function loadPayPalSDK() {
  return new Promise((resolve, reject) => {
    if (window.paypal) { resolve(); return; }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${PAYPAL_CURRENCY}&intent=capture`;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.head.appendChild(script);
  });
}

// ---- CREATE CHECKOUT MODAL ----
function createCheckoutModal() {
  if (document.getElementById('paypalCheckoutModal')) return;

  const modal = document.createElement('div');
  modal.id = 'paypalCheckoutModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:520px;">
      <div class="modal-header">
        <div class="modal-title" id="checkoutTitle">Secure Checkout</div>
        <button class="modal-close" onclick="closeCheckout()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body" style="padding:24px;">
        <!-- Order Summary -->
        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:20px; margin-bottom:20px;">
          <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">Order Summary</div>
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
            <div id="checkoutIcon" style="width:50px; height:50px; background:linear-gradient(135deg,#1a1030,#0a0a1f); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:24px;">🎮</div>
            <div style="flex:1; min-width:0;">
              <div id="checkoutItemTitle" style="font-size:14px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></div>
              <div id="checkoutItemSeller" style="font-size:12px; color:var(--text-muted); margin-top:2px;"></div>
            </div>
          </div>
          <div style="border-top:1px solid var(--border-color); padding-top:14px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
              <span style="color:var(--text-secondary);">Item Price</span>
              <span id="checkoutSubtotal" style="font-weight:600;"></span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
              <span style="color:var(--text-secondary);">Platform Fee (${PLATFORM_FEE_PERCENT}%)</span>
              <span id="checkoutFee" style="font-weight:600; color:var(--text-muted);"></span>
            </div>
            <div style="border-top:1px dashed var(--border-color); margin:10px 0; padding-top:10px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:14px; font-weight:700;">Total</span>
              <span id="checkoutTotal" style="font-family:'Orbitron',monospace; font-size:22px; font-weight:800; color:var(--apex-red);"></span>
            </div>
          </div>
        </div>

        <!-- Security Badge -->
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px; padding:12px 16px; background:rgba(0,255,100,0.05); border:1px solid rgba(0,255,100,0.15); border-radius:8px;">
          <i class="fas fa-shield-alt" style="color:#00ff64; font-size:18px;"></i>
          <div>
            <div style="font-size:13px; font-weight:600; color:#00ff64;">Buyer Protection Active</div>
            <div style="font-size:11px; color:var(--text-muted);">Your payment is secured by PayPal. Full refund if not delivered.</div>
          </div>
        </div>

        <!-- PayPal Button Container -->
        <div id="paypalButtonContainer" style="min-height:55px;"></div>

        <!-- Loading State -->
        <div id="paypalLoading" style="text-align:center; padding:20px; display:none;">
          <i class="fas fa-circle-notch fa-spin" style="font-size:24px; color:var(--apex-red); margin-bottom:8px;"></i>
          <div style="font-size:13px; color:var(--text-muted);">Loading PayPal...</div>
        </div>

        <!-- Alternative Payment Note -->
        <div style="text-align:center; margin-top:16px; padding-top:14px; border-top:1px solid var(--border-color);">
          <div style="font-size:11px; color:var(--text-muted);">
            <i class="fas fa-lock" style="margin-right:4px;"></i>
            Secured by PayPal · Pay with Credit Card, Debit Card, or PayPal Balance
          </div>
        </div>
      </div>
    </div>
  `;

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCheckout();
  });

  document.body.appendChild(modal);
}

// ---- CURRENT ORDER STATE ----
let currentCheckoutItem = null;

// ---- OPEN CHECKOUT ----
async function openCheckout(item) {
  // item = { id, title, price, seller, type, icon }
  const user = getUser();
  if (!user) {
    showToast('Please sign in to purchase!', 'info');
    setTimeout(() => window.location.href = 'login.html', 1200);
    return;
  }

  currentCheckoutItem = item;
  createCheckoutModal();

  // Populate order summary
  const fee = (item.price * PLATFORM_FEE_PERCENT / 100);
  const total = item.price;

  document.getElementById('checkoutTitle').textContent = 'Secure Checkout';
  document.getElementById('checkoutIcon').textContent = item.icon || '🎮';
  document.getElementById('checkoutItemTitle').textContent = item.title;
  document.getElementById('checkoutItemSeller').textContent = `Seller: ${item.seller}`;
  document.getElementById('checkoutSubtotal').textContent = `$${item.price.toFixed(2)}`;
  document.getElementById('checkoutFee').textContent = `Included`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

  // Show modal
  const modal = document.getElementById('paypalCheckoutModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Load PayPal & render buttons
  const btnContainer = document.getElementById('paypalButtonContainer');
  const loadingEl = document.getElementById('paypalLoading');
  btnContainer.innerHTML = '';
  loadingEl.style.display = 'block';

  try {
    await loadPayPalSDK();
    loadingEl.style.display = 'none';

    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 45
      },

      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            description: `NaviApex: ${currentCheckoutItem.title}`,
            amount: {
              currency_code: PAYPAL_CURRENCY,
              value: currentCheckoutItem.price.toFixed(2)
            }
          }]
        });
      },

      onApprove: async function(data, actions) {
        // Show processing state
        btnContainer.innerHTML = `
          <div style="text-align:center; padding:20px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size:28px; color:#00ff64; margin-bottom:10px;"></i>
            <div style="font-size:14px; font-weight:600; color:#00ff64;">Processing Payment...</div>
          </div>
        `;

        try {
          // Capture the payment
          const details = await actions.order.capture();

          // Record the order
          const order = placeOrder({
            type: currentCheckoutItem.type,
            title: currentCheckoutItem.title,
            price: currentCheckoutItem.price,
            seller: currentCheckoutItem.seller,
            paypalOrderId: details.id,
            payerEmail: details.payer?.email_address,
            status: 'completed'
          });

          // Show success
          btnContainer.innerHTML = `
            <div style="text-align:center; padding:20px;">
              <div style="font-size:48px; margin-bottom:12px;">🎉</div>
              <div style="font-size:18px; font-weight:700; color:#00ff64; margin-bottom:6px;">Payment Successful!</div>
              <div style="font-size:13px; color:var(--text-secondary); margin-bottom:4px;">Order ID: ${order.id}</div>
              <div style="font-size:13px; color:var(--text-secondary);">PayPal ID: ${details.id}</div>
              <div style="font-size:12px; color:var(--text-muted); margin-top:12px;">Redirecting to your dashboard...</div>
            </div>
          `;

          showToast(`Payment of $${currentCheckoutItem.price.toFixed(2)} completed! 🎉`, 'success');

          setTimeout(() => {
            closeCheckout();
            window.location.href = 'dashboard.html#orders';
          }, 2500);

        } catch (captureErr) {
          btnContainer.innerHTML = `
            <div style="text-align:center; padding:20px;">
              <div style="font-size:48px; margin-bottom:12px;">❌</div>
              <div style="font-size:16px; font-weight:700; color:var(--apex-red);">Payment Failed</div>
              <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">Please try again or contact support.</div>
            </div>
          `;
          showToast('Payment could not be processed. Please try again.', 'error');
        }
      },

      onCancel: function() {
        showToast('Payment cancelled.', 'info');
      },

      onError: function(err) {
        console.error('PayPal error:', err);
        showToast('Payment error. Please try again.', 'error');
      }
    }).render('#paypalButtonContainer');

  } catch (err) {
    loadingEl.style.display = 'none';
    btnContainer.innerHTML = `
      <div style="text-align:center; padding:20px; color:var(--text-muted);">
        <div style="font-size:14px; margin-bottom:10px;">⚠️ Could not load PayPal</div>
        <div style="font-size:12px;">Please check your internet connection and try again.</div>
        <button class="btn btn-secondary btn-sm" style="margin-top:12px;" onclick="openCheckout(currentCheckoutItem)">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
  }
}

// ---- CLOSE CHECKOUT ----
function closeCheckout() {
  const modal = document.getElementById('paypalCheckoutModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  currentCheckoutItem = null;
}
