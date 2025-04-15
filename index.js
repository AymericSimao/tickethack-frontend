const BACKEND_URL = "https://tickethack-backend-topaz.vercel.app";

function getCookie(key) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(key + "="));
  if (cookie) {
    return cookie.split("=")[1];
  } else {
    return null;
  }
}

function initiateNewCart() {
  fetch(`${BACKEND_URL}/carts/new`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.cookie = `cartId=${data.cart._id};`;
    });
}

if (getCookie("cartId")) {
  console.log(`a cartId exists: ${getCookie("cartId")}`);
} else {
  console.log(`No cartId found. Initiating a new one`);
  initiateNewCart();
}

// On load: Check if we have a cartId cookie exists. If yes, then nothing. If not, then GET /cards/new and save cartId in cookie
document.querySelector("#btn-search").addEventListener("click", function () {
  const departure = document.querySelector("#departure").value;
  const arrival = document.querySelector("#arrival").value;
  const date = new Date(document.querySelector("#date").value).getTime();
  console.log(date);
  console.log("clicked");

  fetch(
    `${BACKEND_URL}/trips?departure=${departure}&arrival=${arrival}&date=${date}`
  )
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#content-right").innerHTML = ``; //on supprime le contenu du bloc de droite
      if (data.trips.length) {
        for (let i = 0; i < data.trips.length; i++) {
          console.log(Date.UTC(Number(data.trips[i].date)));
          const hour = new Date(data.trips[i].date).getUTCHours();
          const minute = new Date(data.trips[i].date).getUTCMinutes();

          document.querySelector("#content-right").innerHTML += `
                <div class="trip">
                    <p>${data.trips[i].departure} > ${data.trips[i].arrival}</p>
                    <p>${String(hour).padStart(2, "0")}:${String(
            minute
          ).padStart(2, "0")}</p>
                    <p>${data.trips[i].price}€</p>
                    <input class="pointer" type="button" value="Book">
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
