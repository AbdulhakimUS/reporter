let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

    function saveData() {
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function addItem() {
      const name = document.getElementById("itemName").value.trim();
      const qty = parseInt(document.getElementById("itemQty").value);

      if (!name || isNaN(qty) || qty <= 0) {
        alert("Please enter a valid item and quantity!");
        return;
      }

      inventory[name] = (inventory[name] || 0) + qty;

      document.getElementById("itemName").value = "";
      document.getElementById("itemQty").value = "";

      saveData();
      updateTable();
    }

    function sellItem() {
      const name = document.getElementById("sellItem").value.trim();
      const qty = parseInt(document.getElementById("sellQty").value);

      if (!inventory[name]) {
        alert("Item not found!");
        return;
      }

      if (isNaN(qty) || qty <= 0) {
        alert("Enter a valid quantity!");
        return;
      }

      if (inventory[name] < qty) {
        alert("Not enough stock available!");
        return;
      }

      inventory[name] -= qty;
      if (inventory[name] === 0) delete inventory[name];

      document.getElementById("sellItem").value = "";
      document.getElementById("sellQty").value = "";

      saveData();
      updateTable();
    }

    function updateTable() {
      const tbody = document.querySelector("#inventoryTable tbody");
      tbody.innerHTML = "";

      for (const item in inventory) {
        const qty = inventory[item];
        const status = qty < 5 ? "low" : "ok";
        const row = `<tr>
          <td>${item}</td>
          <td class="${status}">${qty}</td>
        </tr>`;
        tbody.innerHTML += row;
      }
    }

    updateTable();