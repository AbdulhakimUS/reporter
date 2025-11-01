// === Локальное хранилище данных ===
let state = {
    products: JSON.parse(localStorage.getItem("products") || "{}"),
    orders: JSON.parse(localStorage.getItem("orders") || "[]")
  };
  
  // === Сохранение данных ===
  function saveState() {
    localStorage.setItem("products", JSON.stringify(state.products));
    localStorage.setItem("orders", JSON.stringify(state.orders));
    render();
  }
  
  // === Переключение панелей ===
  document.querySelectorAll(".menu button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".menu button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");
      document.querySelector(`#view-${btn.dataset.view}`).style.display = "block";
    });
  });
  
  // === Добавление товара ===
  function openAddProduct() {
    showModal(`
      <h3>Добавить товар</h3>
      <input id="pname" placeholder="Название" />
      <input id="psku" placeholder="Артикул (уникальный)" />
      <input id="pqty" type="number" placeholder="Количество" />
      <input id="pprice" type="number" placeholder="Цена" />
      <button class="btn" onclick="addProduct()">Сохранить</button>
    `);
  }
  
  function addProduct() {
    const name = document.getElementById("pname").value.trim();
    const sku = document.getElementById("psku").value.trim();
    const qty = +document.getElementById("pqty").value;
    const price = +document.getElementById("pprice").value;
  
    if (!name || !sku || !qty || !price) return alert("Заполните все поля!");
    if (state.products[sku]) return alert("Такой артикул уже существует!");
  
    state.products[sku] = { name, sku, qty, price };
    saveState();
    closeModal();
  }
  
  // === Продажа товара ===
  function openSellProduct() {
    showModal(`
      <h3>Продажа товара</h3>
      <input id="sell_sku" placeholder="Артикул" />
      <input id="sell_qty" type="number" placeholder="Количество" />
      <button class="btn" onclick="sellProduct()">Продать</button>
    `);
  }
  
  function sellProduct() {
    const sku = document.getElementById("sell_sku").value.trim();
    const qty = +document.getElementById("sell_qty").value;
    const product = state.products[sku];
  
    if (!product) return alert("Товар не найден!");
    if (qty <= 0 || qty > product.qty) return alert("Недостаточно на складе!");
  
    product.qty -= qty;
    const order = { sku, qty, date: new Date().toLocaleString() };
    state.orders.push(order);
    saveState();
    closeModal();
  }
  
  // === Рендер ===
  function render() {
    const tbody = document.getElementById("products-table");
    tbody.innerHTML = Object.values(state.products).map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.sku}</td>
        <td>${p.qty}</td>
        <td>${p.price}</td>
        <td><button class="ghost" onclick="deleteProduct('${p.sku}')">Удалить</button></td>
      </tr>
    `).join("");
  
    const totalProducts = Object.keys(state.products).length;
    const totalStock = Object.values(state.products).reduce((a, b) => a + b.qty, 0);
    const lowStock = Object.values(state.products).filter(p => p.qty < 5).length;
  
    document.getElementById("card-total-products").textContent = totalProducts;
    document.getElementById("card-total-stock").textContent = totalStock;
    document.getElementById("card-low-stock").textContent = lowStock;
  
    const ordersDiv = document.getElementById("recent-orders");
    ordersDiv.innerHTML = state.orders.slice(-5).reverse().map(o => `
      <div>Артикул: ${o.sku} — ${o.qty} шт. (${o.date})</div>
    `).join("") || "<div>Пока нет продаж</div>";
  }
  
  function deleteProduct(sku) {
    if (!confirm("Удалить товар?")) return;
    delete state.products[sku];
    saveState();
  }
  
  // === Экспорт данных ===
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "warehouse-data.json";
    a.click();
  }
  
  // === Очистить все данные ===
  function clearAllData() {
    if (confirm("Удалить все данные?")) {
      localStorage.clear();
      state = { products: {}, orders: [] };
      render();
    }
  }
  
  // === Модальное окно ===
  function showModal(html) {
    document.getElementById("modal-content").innerHTML = html;
    document.getElementById("modal").style.display = "flex";
  }
  function closeModal() {
    document.getElementById("modal").style.display = "none";
  }
  document.getElementById("modal").addEventListener("click", e => {
    if (e.target.id === "modal") closeModal();
  });
  
  // === Инициализация ===
  render();
  
  const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  hamburger.classList.toggle("active");
});
