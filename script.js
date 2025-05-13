const elementToggleFunc = (elem) => {
    elem.classList.toggle("active")
  }
  const sidebar = document.querySelector("[data-sidebar]")
  const sidebarBtn = document.querySelector("[data-sidebar-btn]")
  sidebarBtn.addEventListener("click", () => {
    elementToggleFunc(sidebar)
  })
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]")
  const modalContainer = document.querySelector("[data-modal-container]")
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]")
  const overlay = document.querySelector("[data-overlay]")
  const modalImg = document.querySelector("[data-modal-img]")
  const modalTitle = document.querySelector("[data-modal-title]")
  const modalText = document.querySelector("[data-modal-text]")
  const testimonialsModalFunc = () => {
    modalContainer.classList.toggle("active")
    overlay.classList.toggle("active")
  }
  for (const item of testimonialsItem) {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML
      testimonialsModalFunc()
    })
  }
  modalCloseBtn.addEventListener("click", testimonialsModalFunc)
  overlay.addEventListener("click", testimonialsModalFunc)
  const select = document.querySelector("[data-select]")
  const selectItems = document.querySelectorAll("[data-select-item]")
  const selectValue = document.querySelector("[data-selecct-value]")
  const filterBtn = document.querySelectorAll("[data-filter-btn]")
  select.addEventListener("click", function () {
    elementToggleFunc(this)
  })
  for (const item of selectItems) {
    item.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase()
      selectValue.innerText = this.innerText
      elementToggleFunc(select)
      filterFunc(selectedValue)
    })
  }
  const filterItems = document.querySelectorAll("[data-filter-item]")
  const filterFunc = (selectedValue) => {
    for (const item of filterItems) {
      const cats = item.dataset.category
                       .split(',')
                       .map(c => c.trim().toLowerCase());
      if (selectedValue === 'all' || cats.includes(selectedValue)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  }
  let lastClickedBtn = filterBtn[0]
  for (const btn of filterBtn) {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase()
      selectValue.innerText = this.innerText
      filterFunc(selectedValue)
      lastClickedBtn.classList.remove("active")
      this.classList.add("active")
      lastClickedBtn = this
    })
  }
  const form = document.querySelector("[data-form]")
  const formInputs = document.querySelectorAll("[data-form-input]")
  const formBtn = document.querySelector("[data-form-btn]")
  for (const input of formInputs) {
    input.addEventListener("input", () => {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled")
      } else {
        formBtn.setAttribute("disabled", "")
      }
    })
  }
  const navigationLinks = document.querySelectorAll("[data-nav-link]")
  const pages = document.querySelectorAll("[data-page]")
  for (const link of navigationLinks) {
    link.addEventListener("click", function () {
      for (let i = 0; i < pages.length; i++) {
        if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
          pages[i].classList.add("active")
          navigationLinks[i].classList.add("active")
          window.scrollTo(0, 0)
        } else {
          pages[i].classList.remove("active")
          navigationLinks[i].classList.remove("active")
        }
      }
    })
  }
  const cursor = document.querySelector(".cursor")
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px"
    cursor.style.top = e.clientY + "px"
  })
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseover", () => {
      cursor.style.width = "55px"
      cursor.style.height = "55px"
    })
    link.addEventListener("mouseout", () => {
      cursor.style.width = "35px"
      cursor.style.height = "35px"
    })
  })
  document.querySelectorAll(".navbar-link").forEach((link) => {
    link.addEventListener("mouseover", () => {
      cursor.style.width = "55px"
      cursor.style.height = "55px"
    })
    link.addEventListener("mouseout", () => {
      cursor.style.width = "35px"
      cursor.style.height = "35px"
    })
  })
