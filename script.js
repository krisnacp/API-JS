// 'error handling' pada 'fetch()'
const sButton = document.querySelector('.search-button');
// event handler untuk mencari film 
sButton.addEventListener('click', async function() { // untuk menangani 'error handling' pada function yang terdapat 'async & await', bisa menerapkan block 'try and catch'
    try { // 1. 'try' akan menangani ketika states terpenuhi 
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value); 
        updateUI(movies);     
    } catch (error) { // 2. 'catch' akan menangani ketika terjadi kesalahan/error
        tampilError(error); // function untuk menampilkan setiap error
    }
});

// function untuk mengambil data film sesuai inputan user: getMovie()
function getMovies(key) { // karena 'fecth()' hanya bisa membaca error (reject) yang disebabkan oleh 'network' (contohnya seperti penulisan link yang salah), maka kita harus menangani/membuat secara manual output error, jika yang menyebabkan error bukan network 
    return fetch(`http://www.omdbapi.com/?apikey=5463c987&s=${key}`) 
    .then(response => { // pembuatan 'error handling' dari penjelasan diatas akan dibuat di 'then' pertama, yaitu jika error yang terjadi disebabkan oleh link/network yang salah
        // console.log(response); // meng-console.log 'response' untuk melihat nilai yang dikembalikan saat link/network benar dan saat salah
        if(response.ok === false) { // dari nilai kembalian 'response' yang dilihat melalui console.log, kita bisa memanfaatkan value dari properti 'ok' atau 'status' untuk conditional indikator "if". Saat 'response' berhasil, maka value dari 'ok: true' dan 'status: 200', sedangkan saat 'response' error/terjadi kesalahan, maka value dari 'ok': false' dan 'status: 401'
            throw new Error(response.statusText); // 3. 'throw' akan melemparkan error yang terjadi ke block 'catch', pada function yang berhubungan
        } // dan pada 'throw' ini, yang dilemparkan adalah value dari property 'statusText'
        return response.json();
    }) 
    .then(response => { // pembuatan 'error handling' yang kedua ini dilakukan untuk menampilkan erro ketika 'kolom search' kosong atau keyword film tidak ditemukan
        // console.log(response); // console.log 'response' untuk melihat nilai kembaliannya
        if(response.Response === "False") {
            throw new Error(response.Error);
        }
        return response.Search;
    });
}

// function untuk menampilkan film sesuai dengan data: updateUI()
function updateUI(movies) { // untuk function ini tidak perlu dilakukan 'return' karena isinya hanya menjalankan bukan mengembalikan value
    let cards = '';
    movies.forEach(m => {
        cards += showCards(m);
    });
    const movieContiner = document.querySelector('.movie-container');  
    movieContiner.innerHTML=cards; 
}

// Event Binding -> memberikan Event kepada sebuah element yang belum ada, dan Event akan bisa dijalankan ketika element yang dituju ada
document.addEventListener('click', async function(e) { 
    if(e.target.classList.contains('tModal')) { 
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }   
});

// function untuk mengambil data detail movie: getMovieDetail()
function getMovieDetail(detil) {
    return fetch(`http://www.omdbapi.com/?apikey=5463c987&i=${detil}`) 
        .then(hasil => hasil.json()) 
        .then(hasil => hasil)
        .catch(hasil => console.log(hasil.responseText));

}

// function untuk menampilkan detail film: updateUIDetail()
function updateUIDetail(hasil) {
    const isiDetail = showDetail(hasil); 
    const mContainer = document.querySelector('.modal-body'); 
    mContainer.innerHTML=isiDetail;
}

// function untuk menampilkan tiap" error: tampilError()
function tampilError(err) {
    const error = document.querySelector('.movie-container');
    error.innerHTML=err;
}

// showCards()
function showCards(m) {
    return `<div class="col-4 my-3">
                <div class="card mt-4" style="width: 19rem;">
                    <img src="${m.Poster}" class="card-img-top" style="height: 25rem;" alt="Poster of ...">
                    <div class="card-body">
                    <h5 class="card-title">${m.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                    <a href="#" class="tModal btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" data-imdbid="${m.imdbID}">Movie Detail</a>
                    </div>
                </div>
            </div>`;
}

// showDetail()
function showDetail(hasil) {
    return `<div class="row">
                <div class="col-4">
                    <img src="${hasil.Poster}" alt="Poster" class="img-thumbnail">
                </div>
                <div class="col-8">
                    <h2>${hasil.Title} (${hasil.Year})</h2>
                    <p><b>Director:</b> ${hasil.Director}</p>
                    <p><b>Actors:</b> ${hasil.Actors}</p>
                    <p><b>Writer:</b> ${hasil.Writer}</p>
                    <p><b>Plot:</b> <br>${hasil.Plot}</p>
                </div>
            </div>`;
}
