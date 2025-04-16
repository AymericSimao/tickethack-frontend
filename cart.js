const BACKEND_URL = "https://tickethack-backend-topaz.vercel.app";
let cartId = "";
let tripCount = 0;
let trips = [];

function getCookie(key) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(key + "="));
  if (cookie) {
    return cookie.split("=")[1];
  } else {
    return null;
  }
}

function formatDate(dateObject) {
  let years = `${dateObject.getUTCFullYear()}`;
  let months = `${String(dateObject.getUTCMonth()).padStart(2, "0")}`;
  let days = `${String(dateObject.getUTCDate()).padStart(2, "0")}`;
  let hours = `${String(dateObject.getUTCHours()).padStart(2, "0")}`;
  let minutes = `${String(dateObject.getUTCMinutes()).padStart(2, "0")}`;
  return `${years}-${months}-${days} ${hours}:${minutes}`;
}

async function initiateNewCart() {
  let response = await fetch(`${BACKEND_URL}/carts/new`);
  let data = await response.json();
  return data.cart._id;
}

function refreshCartVignette() {
  fetch(`${BACKEND_URL}/carts/count/${cartId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        document.querySelector("#trip-count").textContent = data.tripCount;
        if (data.tripCount === 0) {
          document.querySelector("#trip-count").style.display = "none";
        } else {
          document.querySelector("#trip-count").style.display = "flex";
        }
      } else {
        console.log(`Not able to get tripcount for Cart ${cartId}`);
      }
    });
}

function loadCart(cartId) {
  fetch(`${BACKEND_URL}/carts/${cartId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        document.querySelector("#cart-elements").innerHTML = "";
        refreshCartVignette();
        trips = data.cart.trips;
        tripCount = trips.length;
        if (tripCount === 0) {
          document.querySelector("#cart-elements").innerHTML +=
            "<div><p>Oh come on!</p><p>Go to search and and Book a trip with us.</p></div>";
        } else {
          // prepare and display trips

          trips
            .map((t) => {
              t.date = new Date(t.date);
              t.formatedDate = formatDate(t.date);
              return t;
            })
            .sort((a, b) => a.date - b.date);
          for (let trip of trips) {
            document.querySelector("#cart-elements").innerHTML += `
          <div class="cart-trip" data-tripid=${trip._id}>
            <p>${trip.departure} > ${trip.arrival}</p>
            <p>${trip.formatedDate}</p>
            <p>${trip.price}€</p>
            <input
              class="pointer"
              type="button"
              value="X"
            />
          </div>
          `;
          }
        }
        // prepare and display total
        let total = trips.reduce((tot, trip) => tot + trip.price, 0);
        document.querySelector("#cart-total-euro").textContent = total;
      } else {
        console.log(data.message);
      }
    });
}

async function initiateView() {
  if (getCookie("cartId")) {
    cartId = getCookie("cartId");
    console.log(`a cartId exists: ${cartId}`);
    loadCart(cartId);
  } else {
    console.log(`No cartId found. Initiating a new one`);
    cartId = await initiateNewCart();
    document.cookie = `cartId=${data.cart._id};`;
    loadCart(cartId);
  }
}

document
  .querySelector("#cart-elements")
  .addEventListener("click", function (event) {
    if (event.target.value === "X") {
      // delete trip from cart
      let tripId = event.target.parentNode.getAttribute("data-tripId");
      // cartId
      fetch(`${BACKEND_URL}/carts/trip`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
          tripId: tripId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            console.log(data.message);
            loadCart(cartId);
          } else {
            console.log(data.message);
          }
        });
    }
  });

document
  .querySelector("input[value=Purchase]")
  .addEventListener("click", function () {
    if (tripCount === 0) {
      console.log("No trips to be purchase, do nothing");
    } else {
      // Purchase
      fetch(`${BACKEND_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.result) {
            // redirect to Bookings
            console.log(data.message);
            // get new cart
            cartId = await initiateNewCart();
            document.cookie = `cartId=${cartId};`;
            window.location.href = "bookings.html";
          } else {
            console.log(data.message);
            alert(`Failed to purchase Cart ${cartId}}`);
          }
        });
    }
  });

initiateView();
