
function getInvolved() {
  alert("Thank you for joining the mission 🌍🌱");
}


const categoriesEl = document.getElementById("categories");
const treesEl = document.getElementById("trees");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const modal = document.getElementById("plant-modal");
const spinner = document.getElementById("spinner");
document.getElementById("close-modal").onclick = () => modal.classList.add("hidden");

let cart = [];
let selectedCategoryBtn = null;
let allTrees = [];

function highlightCategory(btn) {
  if (selectedCategoryBtn) {
    selectedCategoryBtn.classList.remove("bg-green-600", "text-white");
    selectedCategoryBtn.classList.add("bg-green-100");
  }
  btn.classList.add("bg-green-600", "text-white");
  btn.classList.remove("bg-green-100");
  selectedCategoryBtn = btn;
}

const categories = [
  "All Trees",
  "Fruit Tree",
  "Flowering Tree",
  "Shade Tree",
  "Medicinal Tree",
  "Timber Tree",
  "Evergreen Tree",
  "Ornamental Plant",
  "Bamboo",
  "Climber",
  "Aquatic Plant"
];

function loadCategories() {
  categoriesEl.innerHTML = "";

  categories.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "px-4 py-2 rounded-lg w-full text-left bg-green-100 hover:bg-green-200";

    btn.onclick = () => {
      highlightCategory(btn);
      loadTrees(cat);
    };

    categoriesEl.appendChild(btn);

    if (index === 0) highlightCategory(btn);
  });
}

async function loadTrees(categoryName = "All Trees") {
  try {
    spinner.classList.remove("hidden");

    if (allTrees.length === 0) {
      const res = await fetch("https://openapi.programming-hero.com/api/plants");
      const data = await res.json();
      allTrees = data.data || data.plants || [];
    }

    let filtered = allTrees;
    if (categoryName !== "All Trees") {
      filtered = allTrees.filter(tree => tree.category === categoryName);
    }

    treesEl.innerHTML = "";

    filtered.forEach(tree => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow p-4 flex flex-col";

      card.innerHTML = `
        <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded-lg mb-3">
        <h4 class="font-semibold cursor-pointer hover:text-green-700">${tree.name}</h4>
        <p class="text-sm text-gray-600 mb-2">${tree.description ? tree.description.slice(0, 60) : ''}...</p>
        <!-- ek line: category + price -->
        <div class="flex justify-between items-center mb-2">
          <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">${tree.category}</span>
          <span class="font-bold">৳${tree.price}</span>
        </div>
        <!-- niche Add to Cart -->
        <button class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 mt-auto">Add to Cart</button>
      `;

      card.querySelector("button").onclick = () => addToCart(tree);
      card.querySelector("h4").onclick = () => showPlantDetail(tree);

      treesEl.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading trees", err);
  } finally {
    spinner.classList.add("hidden");
  }
}
function showPlantDetail(tree) {
  document.getElementById("modal-img").src = tree.image;
  document.getElementById("modal-name").textContent = tree.name;
  document.getElementById("modal-category").textContent = `Category: ${tree.category}`;
  document.getElementById("modal-desc").textContent = tree.description || "No description available";
  document.getElementById("modal-price").textContent = `Price: ৳${tree.price}`;
  modal.classList.remove("hidden");
}
function addToCart(tree) {
  const existing = cart.find(item => item.id === tree.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...tree, qty: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-600">৳${item.price} × ${item.qty}</p>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold text-lg">×</button>
    `;

    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = `৳${total}`;
}
window.onload = () => {
  loadCategories();
  loadTrees();
};
