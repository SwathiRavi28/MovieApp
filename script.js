const TMDB_API_KEY = '303e2885ccc98cd8550ba79f3d2692d7';
const baseUrl = 'https://image.tmdb.org/t/p/original/';
const popularmoviesurl=`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
const fetchActionMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`;
const fetchComedyMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`;
const fetchHorrorMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`;
const fetchRomanceMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`;
var movies = "";
var page = 0;
localStorage.setItem("currenturl", popularmoviesurl)
var moviesarr = [];
  
function pageload(movieurl) {
  var finalurl = (movieurl == 'pgload') ? localStorage.getItem("currenturl") : movieurl;
  
  
  async function fetchMovies(url = '') {
   
    const response = await fetch(url, {
      method: 'GET', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
          'Content-Type': 'application/json',
          
       
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      
    });
    return response.json(); 
  }



  page = page + 1;
  console.log(page)
  fetchMovies(`${finalurl}&page=${page}`) 
    .then(data => {
      var str = "";
      var gallery_obj = document.getElementById('gallery_id');
      const sortval = localStorage.getItem("sort")
      if (sortval != null && sortval !== 'date') {
        var mergeResult = [...moviesarr, ...data.results];
        console.log(mergeResult)
        moviesarr = mergeResult.slice();
        mergeResult.sort((a, b) => ((sortval== 'title') ? a.title > b.title : a.vote_average < b.vote_average) && 1 || -1)
        for (let i = 0; i < mergeResult.length; i++) {
          
           str += ` <div class="gallery__item gallery__item--${(i + 1)}" >
         <a href="#" class="gallery__link">
             <img src=${baseUrl +mergeResult[i].poster_path + '?auto=format&fit=crop&w=1352&q=80'} class="gallery__image">
             <div class="gallery__overlay">
                 <span>Rating : ${mergeResult[i].vote_average}</span>
             </div>
         </a>
     </div>`
         
        }
        gallery_obj.innerHTML = str;
        return
      }
      console.log(data);
      
     
      for (let i = 0; i < 20; i++) {
       moviesarr.push(data.results[i])
        str += ` <div class="gallery__item gallery__item--${(i + 1)}" >
      <a href="#" class="gallery__link">
          <img src=${baseUrl + data.results[i].poster_path + '?auto=format&fit=crop&w=1352&q=80'} class="gallery__image">
          <div class="gallery__overlay">
              <span>Rating : ${data.results[i].vote_average}</span>
          </div>
      </a>
  </div>`
      
      }
      movies = movies + str;
      gallery_obj.innerHTML = movies;
    });

}
pageload(popularmoviesurl)


function filterfunc() {
  page = 0;
  movies = "";
  moviesarr.length = 0;
var e = document.getElementById("filterby");
var selectedOption = e.options[e.selectedIndex].value;
var e1 = document.getElementById("sortby");
e1.options[e1.selectedIndex].value="Date"
  
switch(selectedOption) {
  case "Horror":
    localStorage.setItem("currenturl",fetchHorrorMovies)
    pageload(fetchHorrorMovies)
    break;
  case "Romance":
    localStorage.setItem("currenturl",fetchRomanceMovies)
    pageload(fetchRomanceMovies)
    break;
  case "Comedy":
    localStorage.setItem("currenturl",fetchComedyMovies)
      pageload(fetchComedyMovies)
    break;
  case "Action":
    localStorage.setItem("currenturl",fetchActionMovies)
      pageload(fetchActionMovies)
      break;
  default:
    localStorage.setItem("currenturl",popularmoviesurl)
    pageload(popularmoviesurl)
}

}

function sortfunc(){
 
  
  movies = "";
var e = document.getElementById("sortby");
var selectedOption = e.options[e.selectedIndex].value;

  switch (selectedOption) {
  
    case "Title":
      localStorage.setItem('sort','title')
      sorthelper('title');
    break;
    case "Rating":
      localStorage.setItem('sort','rating')
      sorthelper('rating')
    break;
    case "Date":
      localStorage.setItem('sort', 'date');
      sorthelper('date')
    break;
    default:
      localStorage.setItem('sort', 'date');
      sorthelper('date')
}

}


function sorthelper(selectedsort) {
 
  var str = "";
  var gallery_obj = document.getElementById('gallery_id');
  gallery_obj.innerHTML = "";

  if (selectedsort == 'date') {
    for (let i = 0; i < moviesarr.length; i++) {

      str += ` <div class="gallery__item gallery__item--${(i + 1)}" >
    <a href="#" class="gallery__link">
        <img src=${baseUrl + moviesarr[i].poster_path + '?auto=format&fit=crop&w=1352&q=80'} class="gallery__image">
        <div class="gallery__overlay">
            <span>Rating : ${moviesarr[i].vote_average}</span>
        </div>
    </a>
  </div>`
    
    }
    gallery_obj.innerHTML = str;
    return;
  }

  var sortedarr = moviesarr.slice();
  sortedarr.sort((a, b) => ((selectedsort == 'title') ? a.title > b.title : a.vote_average < b.vote_average) && 1 || -1)
  console.log('sorted ones', sortedarr);
  console.log('movies arr', moviesarr);
 
  for (let i = 0; i < sortedarr.length; i++) {

    str += ` <div class="gallery__item gallery__item--${(i + 1)}" >
  <a href="#" class="gallery__link">
      <img src=${baseUrl + sortedarr[i].poster_path + '?auto=format&fit=crop&w=1352&q=80'} class="gallery__image">
      <div class="gallery__overlay">
          <span>Rating : ${sortedarr[i].vote_average}</span>
      </div>
  </a>
</div>`
  
  }

  gallery_obj.innerHTML = str;     
}

function searchmovie() {
  console.log("searching")
  var searchval = document.getElementById("searchval").value.toLowerCase()
  var filteredarr = [];
  var str = "";
  var gallery_obj = document.getElementById('gallery_id');
  for (let i = 0; i < moviesarr.length; i++){
    var movietitle=moviesarr[i].title.toLowerCase()
    if (movietitle.includes(searchval)) {
      filteredarr.push(moviesarr[i])
      
    }
  }
  console.log(filteredarr)
  for (let i = 0; i < filteredarr.length; i++) {

    str += ` <div class="gallery__item gallery__item--${(i + 1)}" >
  <a href="#" class="gallery__link">
      <img src=${baseUrl + filteredarr[i].poster_path + '?auto=format&fit=crop&w=1352&q=80'} class="gallery__image">
      <div class="gallery__overlay">
          <span>Rating : ${filteredarr[i].vote_average}</span>
      </div>
  </a>
</div>`
  
  }

  gallery_obj.innerHTML =''
  gallery_obj.innerHTML = str;     

  
}

function searching() {
  var searchval = document.getElementById("searchval").value
  if (searchval == "") {
    console.log("alert")
    pageload(localStorage.getItem("currenturl"))
  }
}