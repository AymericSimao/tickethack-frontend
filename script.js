document.querySelector('#btn-search').addEventListener('click', function() {
    const departure = document.querySelector('#departure').value
    const arrival = document.querySelector('#arrival').value
    const date = document.querySelector('#date').value

    fetch(`https://tickethack-backend-topaz.vercel.app/trips/${departure}/${arrival}/${date}/`)
    .then(response=>response.json())
    .then(data=> {
        document.querySelector('#right-beforeSearching').remove() //on supprime le contenu du bloc de droite
        if(data.length > 0){
            for(let i=0;i<data.length;i++){
                document.querySelector('#content-right').innerHTML += `
                <div class="trip">
                    <p>${data[i].departure} > ${data[i].arrival}</p>
                    <p>${data[i].date}</p>
                    <p>${data[i].price}€</p>
                    <input type="button" value="Book">
                </div>`
            }
        }else{
            document.querySelector('#content-right').innerHTML += `
            <img src="./images/notfound.png" alt="not found">
            <hr color="#12aa12" width="100%">
            <p>No trip found.</p>`
        }
    })
})