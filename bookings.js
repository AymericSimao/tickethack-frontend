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


//affichage des bookings à l'ouverture de la page bookings
fetch(`${BACKEND_URL}/bookings`)
.then(response => response.json())
.then((data) => {
    for (let i=0;i<data.result.length;i++){
        for(let j=0;j<data.result[i].trip.length;j++){
            if(data.result[i].trip.length>0){

    console.log(data.result[i].trip[j])
    // document.querySelector('#booking-content').innerHTML = `
    // <div id="booking-elements">
    //         <h2>My bookings</h2>
    //       <div class="booking-trip">
    //         <p>${data.result[i].} > arrival</p>
    //         <p>20:12</p>
    //         <p>53€</p>
    //         <p id="time-before">Departure in 5 hours</p>
    //       </div>
          
    //       <hr width="30%" size="2px" color="black">
    //       <p id="enjoy">Enjoy your travel with TicketHack</p>
    //     </div>`
  }
    }
        }
  

})