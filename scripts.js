document.addEventListener("DOMContentLoaded", function () {
  let orders = [];
  let totalOrderPrice = 0;
  let orderCount = 0;

  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => initializeProductList(data))
    .catch((error) => console.error("Error fetching JSON data:", error));

  function initializeProductList(data) {
    const productList = document.getElementById("product-list");

    data.forEach((product) => {
      const productItem = createProductItem(product);
      productList.appendChild(productItem);
    });

    setupModal();
  }

  function createProductItem(product) {
    const productItem = document.createElement("div");
    productItem.className = "product";

    const productImage = document.createElement("img");
    productImage.src = getImageForDevice(product.image);
    productImage.alt = product.name;

    const productButton = createProductButton(product);

    const productName = document.createElement("p");
    productName.className = "product-category";
    productName.textContent = product.name;

    const productCategory = document.createElement("p");
    productCategory.className = "product-name";
    productCategory.textContent = product.category;

    const productPrice = document.createElement("p");
    productPrice.className = "product-price";
    productPrice.textContent = "$" + product.price.toFixed(2);

    productItem.appendChild(productImage);
    productItem.appendChild(productButton);
    productItem.appendChild(productCategory);
    productItem.appendChild(productName);
    productItem.appendChild(productPrice);

    return productItem;
  }

  function createProductButton(product) {
    const productButton = document.createElement("button");
    productButton.className = "btn";

    const cartIcon = document.createElement("i");
    cartIcon.className = "fa fa-cart-plus cart-icon";
    cartIcon.style.color = "red"; // Set the color to red
    cartIcon.style.fontSize = "24px"; // Increase the font size

    const addToCartText = document.createElement("span");
    addToCartText.className = "add-to-cart-text";
    addToCartText.textContent = "Add to Cart";

    const quantityControls = createQuantityControls();

    productButton.appendChild(cartIcon);
    productButton.appendChild(addToCartText);
    productButton.appendChild(quantityControls);

    productButton.addEventListener("click", () =>
      handleAddToCartClick(product, productButton)
    );

    return productButton;
  }

  function createQuantityControls() {
    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const minusIcon = document.createElement("i");
    minusIcon.className = "fa fa-minus";
    minusIcon.style.color = "#ffffff"; // Set the color to white
    minusIcon.style.fontSize = "14px";
    minusIcon.style.border = "1px solid white";
    minusIcon.style.borderRadius = "50%";
    minusIcon.style.padding = "4px";
    minusIcon.style.marginLeft = "-10px";

    const plusIcon = document.createElement("i");
    plusIcon.className = "fa fa-plus";
    plusIcon.style.color = "#ffffff";
    plusIcon.style.fontSize = "14px";
    plusIcon.style.border = "1px solid white";
    plusIcon.style.borderRadius = "50%";
    plusIcon.style.padding = "4px";
    plusIcon.style.marginRight = "-10px";

    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = "1";
    quantityDisplay.style.color = "#ffffff";
    quantityDisplay.style.margin = "0 10px";

    plusIcon.addEventListener("click", () =>
      handleQuantityChange(quantityDisplay, 1)
    );
    minusIcon.addEventListener("click", () =>
      handleQuantityChange(quantityDisplay, -1)
    );
    quantityControls.appendChild(plusIcon);

    quantityControls.appendChild(quantityDisplay);
    quantityControls.appendChild(minusIcon);
    return quantityControls;
  }

  function handleAddToCartClick(product, productButton) {
    const quantity = parseInt(
      productButton.querySelector(".quantity-controls span").textContent
    );
    orders.push({ product, quantity });
    totalOrderPrice += product.price * quantity;
    updateOrderCount(quantity);
    showModal(product.name, quantity);
    animateIncrement(productButton, quantity);
  }

  function handleQuantityChange(quantityDisplay, delta) {
    let quantity = parseInt(quantityDisplay.textContent);
    quantity = Math.max(1, quantity + delta);
    quantityDisplay.textContent = quantity;
  }

  function updateOrderCount(quantity) {
    orderCount += quantity;
    document.querySelector(
      ".card-item h2"
    ).textContent = `Your Cart (${orderCount})`;
  }

  function showModal(productName, quantity) {
    const modal = document.getElementById("orderModal");
    document.getElementById("productName").value = productName;
    document.getElementById("productQuantity").value = quantity;
    modal.style.display = "block";
  }

  function setupModal() {
    const modal = document.getElementById("orderModal");
    const closeModal = document.querySelector(".close");
    const orderForm = document.getElementById("orderForm");

    closeModal.onclick = () => (modal.style.display = "none");

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    // Handle form submission
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const productName = document.getElementById("productName").value;
      const quantity = document.getElementById("productQuantity").value;
      const product = orders.find(
        (o) => o.product.name === productName
      ).product;
      const totalPrice = (product.price * quantity).toFixed(2);

      showConfirmationPopup(productName, quantity, totalPrice);

      // Hide modal
      modal.style.display = "none";
    });
  }
  function showModal(productName, quantity) {
    const modal = document.getElementById("orderModal");
    const orderItemsList = document.getElementById("orderItemsList");

    // Clear previous items
    orderItemsList.innerHTML = "";

    // Create a new list item for each ordered product
    orders.forEach((order) => {
      const item = document.createElement("div");
      item.className = "order-item";

      const img = document.createElement("img");
      img.src = getImageForDevice(order.product.image);
      img.alt = order.product.name;

      const details = document.createElement("div");
      details.className = "order-item-details";

      const name = document.createElement("p");
      name.className = "order-item-name";
      name.textContent = order.product.name;

      const quantityPrice = document.createElement("p");
      quantityPrice.className = "order-item-quantity-price";
      quantityPrice.textContent = `*${order.quantity}    $${(
        order.product.price * order.quantity
      ).toFixed(2)}`;

      details.appendChild(name);
      details.appendChild(quantityPrice);

      item.appendChild(img);
      item.appendChild(details);
      orderItemsList.appendChild(item);
    });

    document.getElementById("popupTotalPrice").textContent =
      totalOrderPrice.toFixed(2);
    modal.style.display = "block";
  }

  function animateIncrement(productButton, quantity) {
    const incrementAnimation = document.createElement("div");
    incrementAnimation.className = "increment-animation";
    incrementAnimation.textContent = `+${quantity}`;
    productButton.appendChild(incrementAnimation);

    setTimeout(() => {
      productButton.removeChild(incrementAnimation);
    }, 1000);
  }

  function getImageForDevice(imageObj) {
    return window.innerWidth >= 1024 ? imageObj.desktop : imageObj.thumbnail;
  }
});
