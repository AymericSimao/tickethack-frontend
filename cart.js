const BACKEND_URL = "https://tickethack-backend-topaz.vercel.app";
let cartId = "";

function getCookie(key) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(key + "="));
  if (cookie) {
    return cookie.split("=")[1];
  } else {
    return null;
  }
}

async function initiateNewCart() {
  fetch(`${BACKEND_URL}/carts/new`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.cookie = `cartId=${data.cart._id};`;
      return data.cart._id;
    });
}

function loadCart(cartId) {
  fetch(`${BACKEND_URL}/carts/${cartId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      
    });
}

async function initiateView() {
  if (getCookie("cartId")) {
    cartId = getCookie("cartId");
    console.log(`a cartId exists: ${cartId}`);
  } else {
    console.log(`No cartId found. Initiating a new one`);
    cartId = await initiateNewCart();
  }

  loadCart(cartId);
}

initiateView();
