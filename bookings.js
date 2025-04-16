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

function formatDate(dateObject) { //permet d'afficher la date complète avec l'heure
    let years = `${dateObject.getUTCFullYear()}`;
    let months = `${String(dateObject.getUTCMonth()).padStart(2, "0")}`;
    let days = `${String(dateObject.getUTCDate()).padStart(2, "0")}`;
    let hours = `${String(dateObject.getUTCHours()).padStart(2, "0")}`;
    let minutes = `${String(dateObject.getUTCMinutes()).padStart(2, "0")}`;
    return `${years}-${months}-${days} ${hours}:${minutes}`;
  }

//affichage des bookings à l'ouverture de la page bookings
fetch(`${BACKEND_URL}/bookings`)
.then(response => response.json())
.then((data) => {
    document.querySelector('#booking-content').innerHTML = `
    <div id="booking-elements">
        <h2>My bookings</h2>
    </div>`


    for (let i=0;i<data.result.length;i++){
        const years = new Date(data.result[i].date).getUTCFullYear();
        const months = new Date(data.result[i].date).getUTCMonth();
        const days = new Date(data.result[i].date).getUTCDate();
        const hours = new Date(data.result[i].date).getUTCHours();
        const minutes = new Date(data.result[i].date).getUTCMinutes();
        const timeBefore = (Date.parse(data.result[i].date) - new Date()) / (3,6e+6)
        

        document.querySelector('#booking-elements').innerHTML += `
          <div class="booking-trip">
            <div class="dep-arr">
                <p>${data.result[i].departure} > ${data.result[i].arrival}</p>
            </div>
            <div class="dep-date">
                <p class="booking-departure">${String(days).padStart(2, "0")}-${String(months).padStart(2, "0")}-${years} at ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}</p>
            </div>
            <div class="before">
                <p id="time-before">Departure in ${Math.round(timeBefore)} hours</p>
            </div>

          </div>`
  }
  document.querySelector('#booking-elements').innerHTML += `
    <hr width="30%" size="2px" color="black">
    <p id="enjoy">Enjoy your travel with TicketHack</p>`
})