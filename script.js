const TMDB_API_KEY = "Enter APIKEY"
const baseUrl = 'https://image.tmdb.org/t/p/original/'
const popularmoviesurl = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
const fetchActionMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`
const fetchComedyMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`
const fetchHorrorMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`
const fetchRomanceMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`

var movies = ''
var page = 0
localStorage.setItem('currenturl', popularmoviesurl)
var moviesarr = []

//fetch movies data based on url
function pageload(movieurl) {
  var finalurl =
    movieurl == 'pgload' ? localStorage.getItem('currenturl') : movieurl
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
    })
    return response.json()
  }

  page = page + 1

  fetchMovies(`${finalurl}&page=${page}`).then((data) => {
    var str = ''
    var gallery_obj = document.getElementById('gallery_id')
    const sortval = localStorage.getItem('sort')
    if (sortval != null && sortval !== 'date') {
      var mergeResult = [...moviesarr, ...data.results]
      moviesarr = mergeResult.slice()
      mergeResult.sort(
        (a, b) =>
          ((sortval == 'title'
            ? a.title > b.title
            : a.vote_average < b.vote_average) &&
            1) ||
          -1,
      )
      renderFunction(mergeResult)
      return
    }

    for (let i = 0; i < data.results.length; i++) {
      moviesarr.push(data.results[i])
      str += ` <div class="gallery__item gallery__item--${i + 1}" >
      <a href="#" class="gallery__link">
          <img src=${
            baseUrl +
            data.results[i].poster_path +
            '?auto=format&fit=crop&w=1352&q=80'
          } class="gallery__image">
          <div class="gallery__overlay">
              <span>Rating : ${data.results[i].vote_average}</span>
          </div>
      </a>
  </div>`
    }
    movies = movies + str
    gallery_obj.innerHTML = movies
  })
}
//default page loads when application starts
pageload(popularmoviesurl)

//filter functionality starts here
function filterfunc() {
  page = 0
  movies = ''
  moviesarr.length = 0
  var e = document.getElementById('filterby')
  var selectedOption = e.options[e.selectedIndex].value

  switch (selectedOption) {
    case 'Horror':
      localStorage.setItem('currenturl', fetchHorrorMovies)
      pageload(fetchHorrorMovies)
      break
    case 'Romance':
      localStorage.setItem('currenturl', fetchRomanceMovies)
      pageload(fetchRomanceMovies)
      break
    case 'Comedy':
      localStorage.setItem('currenturl', fetchComedyMovies)
      pageload(fetchComedyMovies)
      break
    case 'Action':
      localStorage.setItem('currenturl', fetchActionMovies)
      pageload(fetchActionMovies)
      break
    default:
      localStorage.setItem('currenturl', popularmoviesurl)
      pageload(popularmoviesurl)
  }
}

//sorting based on certain criteria
function sortfunc() {
  movies = ''
  var e = document.getElementById('sortby')
  var selectedOption = e.options[e.selectedIndex].value

  switch (selectedOption) {
    case 'Title':
      localStorage.setItem('sort', 'title')
      sorthelper('title')
      break
    case 'Rating':
      localStorage.setItem('sort', 'rating')
      sorthelper('rating')
      break
    default:
      localStorage.setItem('sort', 'date')
      sorthelper('date')
  }
}

function sorthelper(selectedsort) {
  if (selectedsort == 'date') {
    renderFunction(moviesarr)
    return
  }
  var sortedarr = moviesarr.slice()
  sortedarr.sort(
    (a, b) =>
      ((selectedsort == 'title'
        ? a.title > b.title
        : a.vote_average < b.vote_average) &&
        1) ||
      -1,
  )
  renderFunction(sortedarr)
}

//global search start point
function searchmovie() {
  var searchval = document.getElementById('searchval').value.toLowerCase()
  var filteredarr = []
  for (let i = 0; i < moviesarr.length; i++) {
    var movietitle = moviesarr[i].title.toLowerCase()
    if (movietitle.includes(searchval)) {
      filteredarr.push(moviesarr[i])
    }
  }
  renderFunction(filteredarr)
}

//global search helper on change event
function searching() {
  var searchval = document.getElementById('searchval').value
  if (searchval == '') {
    console.log('alert')
    pageload(localStorage.getItem('currenturl'))
  }
}

//Render poster of movies
function renderFunction(images) {
  var str = ''
  var gallery_obj = document.getElementById('gallery_id')
  for (let i = 0; i < images.length; i++) {
    str += ` <div class="gallery__item gallery__item--${i + 1}" >
  <a href="#" class="gallery__link">
      <img src=${
        baseUrl + images[i].poster_path + '?auto=format&fit=crop&w=1352&q=80'
      } class="gallery__image">
      <div class="gallery__overlay">
          <span>Rating : ${images[i].vote_average}</span>
      </div>
  </a>
</div>`
  }
  gallery_obj.innerHTML = '' //to make sure the images is not over writed.
  gallery_obj.innerHTML = str
}
