// ===== Menu Toggle =====
const toggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.header-menu')

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open')
  })
}

// ===== Product Fetching =====

async function getProducts(filters = {}) {
  const queryParams = new URLSearchParams(filters)
  const res = await fetch(`/api/products?${queryParams}`)
  return await res.json()
}

// ===== Product Rendering =====

function renderProducts(products) {
  const albumsContainer = document.getElementById('products-container')
  if (!albumsContainer) return
  albumsContainer.innerHTML = '' // Clear previous content
  products.forEach((album) => {
    const card = document.createElement('div')
    card.className = 'product-card'

    const img = document.createElement('img')
    // Only allow image filenames (no slashes, no protocols)
    const safeImage = typeof album.image === 'string' && /^[\w\-\.]+$/.test(album.image) ? album.image : 'default.png'
    img.src = `./images/${safeImage}`
    img.alt = album.title || ''
    card.appendChild(img)

    const h2 = document.createElement('h2')
    h2.textContent = album.title || ''
    card.appendChild(h2)

    const h3 = document.createElement('h3')
    h3.textContent = album.artist || ''
    card.appendChild(h3)

    const priceP = document.createElement('p')
    priceP.textContent = `$${album.price}`
    card.appendChild(priceP)

    const addBtn = document.createElement('button')
    addBtn.className = 'add-btn'
    addBtn.textContent = 'Add to Cart'
    card.appendChild(addBtn)

    const genreP = document.createElement('p')
    genreP.className = 'genre-label'
    genreP.textContent = album.genre || ''
    card.appendChild(genreP)

    albumsContainer.appendChild(card)
  })
}

// ===== Genre Dropdown =====

/**
 * Populates the genre dropdown with available genres from the API.
 */
async function populateGenreSelect() {
  try {
    const res = await fetch('/api/products/genres')
    if (!res.ok) {
      console.error('Failed to fetch genres:', res.status, res.statusText)
      return
    }
    const genres = await res.json()
    const select = document.getElementById('genre-select')
    if (!select) return
    select.innerHTML = '' // clear existing options
    genres.forEach(genre => {
      const option = document.createElement('option')
      option.value = genre
      option.textContent = genre
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Network error while fetching genres:', error)
  }
}

// ===== Initialization =====

async function init() {
  await populateGenreSelect()
  const products = await getProducts()
  renderProducts(products)
}

// ===== Filter Handling =====

/**
 * Fetches and renders products based on the current search input.
 */
async function applySearchFilter() {
  const input = document.getElementById('search-input')
  if (!input) return
  const search = input.value.trim()
  const filters = {}
  if (search) filters.search = search

  const products = await getProducts(filters)
  renderProducts(products)
}

// ===== Event Listeners =====

const searchInput = document.getElementById('search-input')
if (searchInput) {
  searchInput.addEventListener('input', () => {
    applySearchFilter()
  })
}

const form = document.querySelector('form')
if (form) {
  // prevent default submit and run search
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    applySearchFilter()
  })
}

const genreSelect = document.getElementById('genre-select')
if (genreSelect) {
  genreSelect.addEventListener('change', async (e) => {
    const genre = e.target.value
    const products = await getProducts(genre ? { genre } : {})
    renderProducts(products)
  })
}

// start the app
init()
