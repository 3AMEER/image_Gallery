
const imagesWrapper = document.querySelector('.images');
const loadMore = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input')
const lightbox = document.querySelector('.lightbox')
const closeBtn = document.querySelector('.fa-times')
const downloadImgBtn = document.querySelector('.fa-download')

// API Key, SearchTerm varibles, paginations
const apiKey = 'kLWN320vrhywHkUhUerULHL5iHCJUieLZGd3yLffCAYXQQvqRv9ifAIn';
const prePage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    // console.log(imgURL);

    fetch(imgURL).then(res => res.blob()).then(File => {

        const a = document.createElement('a');
        a.href = URL.createObjectURL(File);
        a.download = new Date().getTime();
        a.click()

    }).catch(() => alert("Failed To Download Image😎"))
}

const showlightbox = (name, img) => {
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerHTML = name;
    downloadImgBtn.setAttribute("data-img", img)
    lightbox.classList.add("show")
    document.body.style.overflow = "hidden";
}

const hidlightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (Images) => {
    imagesWrapper.innerHTML += Images.map(img => 
        `
        <li class="card" onclick="showlightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">

            <div class="details">
                <div class="photograper">
                    <i class="fa-solid fa-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}')">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
        </li>`
        ).join("")
}


const getImages = (apiURL) => {
    // Fetch Images With API call With Authorization header
    loadMore.innerHTML = 'Loading...';
    loadMore.classList.add('disabled')
    fetch(apiURL, {
        headers: {Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        console.log(data);
        loadMore.innerHTML = 'Load More';
        loadMore.classList.remove('disabled')
    }).catch(() => alert("Failed To Load Images ☺"))
}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${prePage}`);

const loadMoreImages = () => {
    currentPage++
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${prePage}`
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${prePage}` : apiUrl
    getImages(apiUrl)
}


// Search Input 
const loadSearchImages = (e) => {
    if (e.target.value === "") return searchTerm = null;
    // if pressed Key is Enter, Update The current page, search term & call the getImages
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = '';
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${prePage}`)
    }
}

loadMore.addEventListener('click', loadMoreImages)
searchInput.addEventListener('keyup', loadSearchImages)
closeBtn.addEventListener('click', hidlightbox)
closeBtn.addEventListener('click', hidlightbox)
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img))
