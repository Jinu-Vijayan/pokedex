const TYPE_FORM = document.querySelector("#type-form");
const TYPE_SELECTION = document.querySelector("#type-selection");
const POKEMON_CONTAINER = document.querySelector("#pokemon-container");


// URLS
const TYPE_URL = "https://pokeapi.co/api/v2/type/";
const POKEMON_URL  = "https://pokeapi.co/api/v2/pokemon?limit=36&offset=0"

let nextUrl;
let previousUrl;
let typeMap = {};

/*************************************************************************
 getAndCreateOptions function will get the types from the backend and dynamically create the options in the select tag

 @return none
***************************************************************************/

function getAndCreateOptions(){

    fetch(TYPE_URL)
    .then(response => response.json())
    .then(data => {

        data.results.forEach((option) => {

            typeMap[option.name] = option.url;

            const  OPTION = document.createElement("option");
            OPTION.innerText = option.name;
            OPTION.setAttribute("value",option.name);

            TYPE_SELECTION.appendChild(OPTION);

        })

    })

}

function createPokemonCards(pokemonArray){

    pokemonArray.forEach((pokemon) => {

        fetch(pokemon.url)
        .then(response => response.json())
        .then(pokemonDetails => {

            // console.log(pokemonDetails.stats)

            const POKEMON_CARD = document.createElement("div");
            const POKEMON_CARD_FRONT = document.createElement("div");
            const POKEMON_CARD_BACK = document.createElement("div");
            const NUMBER_AND_TYPE_COLOR = document.createElement("div");
            const FIGURE = document.createElement("figure");
            const WEIGHT_HEIGHT_CONTAINER = document.createElement("div");
            const TYPE_CONTAINER = document.createElement("div");
            const STATS = document.createElement("div");


            NUMBER_AND_TYPE_COLOR.innerHTML = `
                <p>${pokemonDetails.id}<p>
                <div><div>
            `
            FIGURE.innerHTML = `
                <img src="${pokemonDetails.sprites.front_default}"
                alt="image of ${pokemonDetails.name}">
                <figcaption>${pokemonDetails.name}</figcaption>
            `
            WEIGHT_HEIGHT_CONTAINER.innerHTML = `
                <div>
                <p>height</p>
                <p>${pokemonDetails.height}</p>
                </div>
                <div>
                    <p>weight</p>
                    <p>${pokemonDetails.weight}</p>
                </div>
            `
            STATS.innerHTML = `
                <p><span>HP:</span><span>${pokemonDetails.stats[0].base_stat}</span></p>
                <p><span>ATK:</span><span>${pokemonDetails.stats[1].base_stat}</span></p>
                <p><span>DEF:</span><span>${pokemonDetails.stats[2].base_stat}</span></p>
                <p><span>SATK:</span><span>${pokemonDetails.stats[3].base_stat}</span></p>
                <p><span>SDEF:</span><span>${pokemonDetails.stats[4].base_stat}</span></p>
                <p><span>SPD:</span><span>${pokemonDetails.stats[5].base_stat}</span></p>
            `

            pokemonDetails.types.forEach((type) => {
                let p = document.createElement("p");
                p.innerText = type.type.name
                TYPE_CONTAINER.appendChild(p);
            })

            POKEMON_CARD.classList.add("pokemon-card");
            POKEMON_CARD_FRONT.classList.add("pokemon-card-front");
            NUMBER_AND_TYPE_COLOR.classList.add("number-and-type-color-container");
            WEIGHT_HEIGHT_CONTAINER.classList.add("weight-height-container");
            TYPE_CONTAINER.classList.add("type-container");
            POKEMON_CARD_BACK.classList.add("pokemon-card-back");
            STATS.classList.add("stats")

            POKEMON_CARD_FRONT.append(NUMBER_AND_TYPE_COLOR,FIGURE,WEIGHT_HEIGHT_CONTAINER,TYPE_CONTAINER);
            POKEMON_CARD_BACK.appendChild(STATS);
            POKEMON_CARD.append(POKEMON_CARD_FRONT,POKEMON_CARD_BACK);

            POKEMON_CONTAINER.appendChild(POKEMON_CARD);


        })

    })
}

/*************************************************************************
 getPokemonData function will get the data about pokemon from the given url

 @param {String} url - the url from which pokemon data can be obtained

 @return none
***************************************************************************/
function getPokemonData(url){
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        nextUrl = data.next;
        previousUrl = data.previous;
        createPokemonCards(data.results);
    })
}


/***************************************************************************
 onloadHandler fucntion will do two things
 1) call function to get and fill data in the select tag for types
 2) call function to get and create the first set of pokemon cards
 
 @return none
***************************************************************************/
function onloadHandler(){

    getAndCreateOptions();
    getPokemonData(POKEMON_URL)

}

/*************************************************************************
 filterHandler function is used to filter the pokemon according to user input

 @param {Object} e - data regarding the click event
 @return none
***************************************************************************/
function filterHandler(e){

    e.preventDefault();

    if(e.target.id === "reset-btn"){
        TYPE_SELECTION.value = "all";
    }
}

document.addEventListener("DOMContentLoaded", onloadHandler)

TYPE_FORM.addEventListener("click", filterHandler)