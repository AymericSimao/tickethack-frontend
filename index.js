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

async function initiateView() {
  if (getCookie("cartId")) {
    cartId = getCookie("cartId");
    console.log(`a cartId exists: ${cartId}`);
  } else {
    console.log(`No cartId found. Initiating a new one`);
    cartId = await initiateNewCart();
    document.cookie = `cartId=${cartId};`;
  }
  // Load cart vignette
  refreshCartVignette();
  // Load city lists
  fetch(`${BACKEND_URL}/trips/city`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Departure
      document.querySelector(
        "#departure"
      ).innerHTML = `<option value="--">-Departure-</option>`;
      for (city of data.departure) {
        document.querySelector(
          "#departure"
        ).innerHTML += `<option value="${city}">${city}</option>`;
      }
      // Arrival
      document.querySelector(
        "#arrival"
      ).innerHTML = `<option value="--">-Arrival-</option>`;
      for (city of data.arrival) {
        document.querySelector(
          "#arrival"
        ).innerHTML += `<option value="${city}">${city}</option>`;
      }
    });
}

initiateView();

// On load: Check if we have a cartId cookie exists. If yes, then nothing. If not, then GET /cards/new and save cartId in cookie
document.querySelector("#btn-search").addEventListener("click", function () {
  const departure = document.querySelector("#departure").value;
  const arrival = document.querySelector("#arrival").value;
  const date = new Date(document.querySelector("#date").value).getTime();
  console.log(`Searching for trips ${departure}>${arrival} on day: ${date}`);

  fetch(
    `${BACKEND_URL}/trips?departure=${departure}&arrival=${arrival}&date=${date}`
  )
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#content-right").innerHTML = ``; //on supprime le contenu du bloc de droite
      if (data.trips.length) {
        for (let i = 0; i < data.trips.length; i++) {
          const hours = new Date(data.trips[i].date).getUTCHours();
          const minutes = new Date(data.trips[i].date).getUTCMinutes();

          document.querySelector("#content-right").innerHTML += `
                <div class="trip">
                    <p>${data.trips[i].departure} > ${data.trips[i].arrival}</p>
                    <p>${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}</p>
                    <p>${data.trips[i].price}€</p>
                    <input class="pointer" type="button" value="Book" data-tripid=${data.trips[i]._id}>
                </div>`;
        }
      } else {
        document.querySelector("#content-right").innerHTML += `
            <img src="./images/notfound.png" alt="not found">
            <hr color="#12aa12" width="100%">
            <p>No trip found.</p>`;
      }
    });
});

document
  .querySelector("#content-right")
  .addEventListener("click", function (event) {
    // Is click done on Book button ?
    if (event.target.value === "Book") {
      console.log(
        `Add trip: ${event.target.getAttribute(
          "data-tripid"
        )} to cart: ${cartId}`
      );
      // Put trip in cart
      fetch(`${BACKEND_URL}/carts/trip`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
          tripId: event.target.getAttribute("data-tripid"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            // redirect to Cart
            console.log(data.message);
            window.location.href = "cart.html";
          } else {
            console.log(data.message);
            alert("Failed to add trip to cart");
          }
        });
    }
  });
