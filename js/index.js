const apiURL = "https://botw-compendium.herokuapp.com/api/v2/category/materials"

const itemsDatabase = []
const locationsLookup = []


const getItemsDatabase = async () => {
    try {

        const responseFromAPI = await fetch(apiURL)
        const jsonData = await responseFromAPI.json()
        console.log(`data received from API: ${jsonData}`)

        for (let _id in jsonData) {
            for (let i = 0; i < jsonData.data.length; i++) {
                const itemsDatabaseObj = {
                    id: jsonData.data[i].id,
                    name: jsonData.data[i].name,
                    description: jsonData.data[i].description,
                    image: jsonData.data[i].image,
                }
                const locationLookupObj = {
                    location: jsonData.data[i].common_locations[0],
                    idArray: ['id'],
                    id: jsonData.data[i].id
                }
                var newLocationsLookupArray = jsonData.data[i].id
                locationLookupObj['idArray'].push(newLocationsLookupArray)

                itemsDatabase.push(itemsDatabaseObj)
                locationsLookup.push(locationLookupObj)
            }
        }

        let itemsDatabaseArray = [].concat.apply([], itemsDatabase)
        let locationsLookupArray = [].concat.apply([], locationsLookup)

        // console.log(itemsDatabaseArray)
        console.table(itemsDatabaseArray)
        console.table(locationsLookupArray)

         const searchButtonClick = () => {
            const searchName = document.querySelector("input").value
            const results = []
            for (let k = 0; k < itemsDatabaseArray.length; k++) {
                if (itemsDatabaseArray[k].name.includes(searchName) === true) {
                    console.log(`Name Found: ${itemsDatabaseArray[k].name}`)
                    results.push(itemsDatabaseArray[k])
                }
            }
           
            if (results.length === 0) {
                console.log(`No match found`)
                document.querySelector("#database").innerHTML = "<p>No Match Found</p>"
            }
            else {
                console.log(`Number of name found ${results.length}`)
                document.querySelector("#database").innerHTML = ``

                for (let i = 0; i < results.length; i++) {
                    const currItemDatabase = results[i]
                    document.querySelector("#database").innerHTML += `
                        <div  class="row display">
                       
                             <div class="col-4 tablesize">
                                <img  src="${currItemDatabase.image}"/>
                             </div>  
                             <div class="col-4 display1 tablesize">
                                <h2 class="name">${currItemDatabase.name}</h2>
                                <div class="col-4 tablesize">
                                <button id="addFav">Favourite</button>
                                </div>
                                <p class="detail">${currItemDatabase.description}</p>
                            </div> 
                        </div>   
                        `  
                        $("#addFav").on("click",function(){
                            console.log("Adding to fav")
                            addFavList(currItemDatabase)
                        })   
                }
            }
           
        }
        var favDataList = new Array()
        const KEY_NAME = "favDataList"

        const addFavList = (newData) => {
                console.log(`name: ${newData.name}`)
                // localStorage.setItem("name",newData.name)
                // localStorage.setItem("image", newData.image)

                favDataList.push(newData)
                localStorage.setItem(KEY_NAME, JSON.stringify(favDataList))
                
        }
        
        const searchByLocation = (requestedLocation) => {
            const results = []
            for (let i = 0; i < locationsLookupArray.length; i++) {
                if (requestedLocation === locationsLookupArray.location) {
                    console.log(`Found: ${locationsLookupArray[i].location}`)
                    results.push(locationsLookupArray[i])
                }
            }
            return results
        }

        const displaySearch = (searchResultArray) => {
            if (searchResultArray.length === 0) {
                console.log(`No match found`)
                document.querySelector("#database").innerHTML = "<p>No Match Found</p>"
            } else {
                console.log(`Number of name found ${results.length}`)
                document.querySelector("#database").innerHTML = ``

                for (let i = 0; i < results.length; i++) {
                    const currItemDatabase = results[i]
                    document.querySelector("#database").innerHTML += `
                        <div class="row display">
                             <div class="col-4 tablesize">
                                <img src="${currItemDatabase.image}"/>
                             </div>  
                             <div class="col-4 display1 tablesize">
                                <h2 class="name">${currItemDatabase.name}</h2>
                                <div class="col-4 tablesize">
                            
                                </div>
                                <p class="detail">${currItemDatabase.description}</p>
                            </div>
                            
                        </div>
                    
                        `
                }

            }
        }
        const dropdownChanged = () => {
            console.log("Value in dropdown changed")
            const selectedType = document.querySelector("select").value
            console.log(selectedType)
            const results = searchByLocation(selectedType)
            displaySearch(results)
        }

        document.querySelector("#search").addEventListener("click", searchButtonClick)
        document.querySelector("select").addEventListener("change", dropdownChanged)

    } catch (err) {
        console.log(`error while fetching data from API : ${err}`)
    }
}
getItemsDatabase()