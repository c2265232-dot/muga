// ---------------- DATABASE ----------------
let DB = JSON.parse(localStorage.getItem("gamehub")) || {
  games: [],
  favorites: [],
  comments: {},
  categories: ["All","Arcade","Action","Racing"]
};

function saveDB(){
  localStorage.setItem("gamehub", JSON.stringify(DB));
}

// ---------------- TAB CUSTOMIZATION ----------------
function setTab(title, icon){
  document.title = title;

  let link = document.querySelector("link[rel='icon']");
  if(!link){
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = icon;

  localStorage.setItem("tabTitle", title);
  localStorage.setItem("tabIcon", icon);
}

// LOAD TAB SETTINGS
if(localStorage.getItem("tabTitle")){
  setTab(
    localStorage.getItem("tabTitle"),
    localStorage.getItem("tabIcon")
  );
}

// ---------------- GENERATE 200 GAMES ----------------
if(DB.games.length === 0){
  for(let i=1;i<=200;i++){
    DB.games.push({
      name: "Game " + i,
      url: "https://example.com",
      thumb: "https://via.placeholder.com/200",
      category: DB.categories[i % DB.categories.length]
    });
  }
  saveDB();
}

// ---------------- RENDER ----------------
function renderGames(filter="", category="All"){
  let grid = document.getElementById("grid");
  if(!grid) return;

  grid.innerHTML = "";

  DB.games
    .filter(g =>
      g.name.toLowerCase().includes(filter.toLowerCase()) &&
      (category === "All" || g.category === category)
    )
    .forEach(g => {
      let fav = DB.favorites.includes(g.name);

      let div = document.createElement("div");
      div.className = "card fade";

      div.innerHTML = `
        <img src="${g.thumb}">
        <h3>${g.name}</h3>
        <p>${g.category}</p>

        <button onclick="play('${g.url}','${g.name}')">Play</button>
        <button onclick="toggleFav('${g.name}')">
          ${fav ? "★" : "☆"}
        </button>
      `;

      grid.appendChild(div);
    });
}

// ---------------- PLAY ----------------
let currentGame = null;

function play(url,name){
  document.getElementById("frame").src = url;
  currentGame = name;
  loadComments(name);
}

// ---------------- FAVORITES ----------------
function toggleFav(name){
  if(DB.favorites.includes(name)){
    DB.favorites = DB.favorites.filter(f=>f!==name);
  } else {
    DB.favorites.push(name);
  }
  saveDB();
  renderGames();
}

// ---------------- COMMENTS ----------------
function addComment(){
  let input = document.getElementById("commentInput");

  if(!DB.comments[currentGame]){
    DB.comments[currentGame] = [];
  }

  DB.comments[currentGame].push(input.value);
  input.value = "";

  saveDB();
  loadComments(currentGame);
}

function loadComments(game){
  let box = document.getElementById("comments");
  if(!box) return;

  box.innerHTML = "";

  (DB.comments[game] || []).forEach(c=>{
    let p = document.createElement("p");
    p.innerText = c;
    box.appendChild(p);
  });
}

// ---------------- SEARCH ----------------
let search = document.getElementById("search");
if(search){
  search.oninput = () => renderGames(search.value);
}

// ---------------- CATEGORY FILTER ----------------
function renderCategories(){
  let bar = document.getElementById("categories");
  if(!bar) return;

  DB.categories.forEach(c=>{
    let btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => renderGames("", c);
    bar.appendChild(btn);
  });
}
renderCategories();

// ---------------- ADMIN ----------------
function addGame(){
  let name = document.getElementById("gName").value;
  let url = document.getElementById("gURL").value;
  let thumb = document.getElementById("gThumb").value;
  let cat = document.getElementById("gCat").value;

  DB.games.push({name,url,thumb,category:cat});
  saveDB();
  alert("Game added!");
}

function addCategory(){
  let c = document.getElementById("newCat").value;
  DB.categories.push(c);
  saveDB();
  alert("Category added!");
}

// ---------------- INIT ----------------
renderGames();
