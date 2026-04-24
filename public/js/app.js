// Shared frontend helpers — header, footer, cart count, toast, fetch wrapper
const API = '/api';

// ---------- Header ----------
function renderHeader() {
  const header = `
    <header class="site-header">
      <div class="container">
        <nav class="nav">
          <a href="/" class="brand">Marie Maison<small>MAISON DE JOAILLERIE</small></a>
          <button class="menu-toggle" aria-label="Menu" onclick="document.getElementById('navLinks').classList.toggle('open')">☰</button>
          <ul class="nav-links" id="navLinks">
            <li><a href="/">Home</a></li>
            <li><a href="/shop.html">Shop</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/admin.html">Admin</a></li>
            <li><a href="/cart.html" class="cart-link">Cart (<span id="cartCount">0</span>)</a></li>
          </ul>
        </nav>
      </div>
    </header>`;
  const slot = document.getElementById('header');
  if (slot) slot.outerHTML = header;
}

// ---------- Footer ----------
function renderFooter() {
  const footer = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>Marie Maison</h4>
            <p style="font-size:.9rem;line-height:1.7;">Maison de Joaillerie since 1948. Crafted in Paris with timeless materials and quiet elegance.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <a href="/shop.html?cat=rings">Rings</a>
            <a href="/shop.html?cat=necklaces">Necklaces</a>
            <a href="/shop.html?cat=earrings">Earrings</a>
            <a href="/shop.html?cat=bracelets">Bracelets</a>
            <a href="/shop.html?cat=anklets">Anklets</a>
          </div>
          <div>
            <h4>Maison</h4>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
            <a href="/admin.html">Admin</a>
          </div>
          <div>
            <h4>Contact</h4>
            <p style="font-size:.85rem;">12 Place Vendôme<br>75001 Paris<br>+33 1 42 60 00 00</p>
          </div>
        </div>
        <div class="footer-bottom">© ${new Date().getFullYear()} Marie Maison — All rights reserved.</div>
      </div>
    </footer>`;
  const slot = document.getElementById('footer');
  if (slot) slot.outerHTML = footer;
}

// ---------- Toast ----------
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Cart count ----------
async function refreshCartCount() {
  try {
    const res = await fetch(`${API}/cart`);
    const data = await res.json();
    const el = document.getElementById('cartCount');
    if (el) el.textContent = data.count || 0;
  } catch (e) { /* ignore */ }
}

// ---------- Add to cart ----------
async function addToCart(productId, qty = 1) {
  try {
    const res = await fetch(`${API}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: qty }),
    });
    if (!res.ok) throw new Error('Failed');
    toast('Added to cart');
    refreshCartCount();
  } catch (e) {
    toast('Could not add to cart');
  }
}

// ---------- Format price ----------
function formatPrice(n) {
  return '€' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ---------- Init on every page ----------
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  refreshCartCount();
});
