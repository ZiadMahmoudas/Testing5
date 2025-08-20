document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".hero-section");
  const heroImage = document.querySelector(".hero-image");
  const slides = document.querySelectorAll(".slide");
  const thumbnails = document.querySelectorAll(".image-thumbnail");
  const dots = document.querySelectorAll(".dot");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const loadingBar = document.querySelector(".loading-bar");
  const transitionTime = 3400;
  const textAnimationDuration = 1000;
  const imageTransitionDuration = 500;

  const data = [
    {
      imgTop: "Fourth.webp",
      imageHeader: "Fourth.webp",
      Header: "اما-ziad",
      paragraph: "باقة الهوية البصرية",
      secondSmallHeader: `شركة صيانة السيارات تختص في صيانتها على الكهربائيات الخاصة بالسيارات وهي الوكيل الحصري لصيانة سيارات نيسان.`,
      buttonText: "المزيد من التفاصيل",
    },
    {
      imgTop: "second.webp",
      imageHeader: "second.webp",
      Header: "MR.Taif",
      paragraph: "باقة الهوية البصرية",
      secondSmallHeader: `شركة صيانة السيارات تختص في صيانتها على الكهربائيات الخاصة بالسيارات وهي الوكيل الحصري لصيانة سيارات نيسان.`,
      buttonText: "المزيد من التفاصيل",
    },
    {
      imgTop: "Third.webp",
      imageHeader: "Third.webp",
      Header: "اما-Amma",
      paragraph: "باقة الهوية البصرية",
      secondSmallHeader: `شركة صيانة السيارات تختص في صيانتها على الكهربائيات الخاصة بالسيارات وهي الوكيل الحصري لصيانة سيارات نيسان.`,
      buttonText: "المزيد من التفاصيل",
    },
    {
      imgTop: "FollowMain.webp",
      imageHeader: "FollowMain.webp",
      Header: "اما-Amma",
      paragraph: "باقة الهوية البصرية",
      secondSmallHeader: `شركة صيانة السيارات تختص في صيانتها على الكهربائيات الخاصة بالسيارات وهي الوكيل الحصري لصيانة سيارات نيسان.`,
      buttonText: "المزيد من التفاصيل",
    },
  ];

  let currentSlide = 0;
  let autoplayInterval;
  let isAnimating = false;
  let thumbnailDataOrder = [...data];

  function updateContent(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    const newImageUrl = data[index].imgTop;
    heroImage.src = newImageUrl;
    heroSection.style.setProperty(
      "--background-image-url",
      `url(${newImageUrl})`
    );
  }

  function updateThumbnailsVisual(currentIndex) {
    const start = currentIndex;
    const total = data.length;

    thumbnails.forEach((thumbnail, i) => {
      const dataIndex = (start + i) % total;
      thumbnail.querySelector("img").src = data[dataIndex].imageHeader;
      thumbnail.dataset.index = dataIndex;
      thumbnail.classList.remove("active");
    });

    thumbnails.forEach((thumbnail) => {
      if (parseInt(thumbnail.dataset.index) === currentIndex) {
        thumbnail.classList.add("active");
      }
    });
  }
  heroImage.addEventListener("load", () => {
    heroImage.classList.add("show");
  });

  function goToSlide(index, fromThumbnailClick = false) {
    if (isAnimating || currentSlide === index) {
      isAnimating = false;
      return;
    }

    isAnimating = true;
    const oldIndex = currentSlide;

    if (fromThumbnailClick) {
      const clickedThumbnail = thumbnails[index];
      const heroRect = heroSection.getBoundingClientRect();
      const thumbRect = clickedThumbnail.getBoundingClientRect();

      const clone = clickedThumbnail.querySelector("img").cloneNode(true);
      clone.classList.add("thumbnail-clone");
      document.body.appendChild(clone);
      gsap.set(clone, {
        x: thumbRect.left,
        y: thumbRect.top,
        width: thumbRect.width,
        height: thumbRect.height,
        opacity: 1,
      });
      gsap.to(clone, {
        x: heroRect.left,
        y: heroRect.top,
        width: heroRect.width,
        height: heroRect.height,
        duration: 0.8,
        ease: "power2.inOut",
        onStart: () => {
          heroImage.classList.remove("show");
        },
        onComplete: () => {
          currentSlide = parseInt(clickedThumbnail.dataset.index);
          updateContent(currentSlide);
          updateThumbnailsVisual(currentSlide);
          heroImage.classList.add("show");
          clone.remove();
          loadingBar.classList.add("active");
          isAnimating = false;
        },
      });
    } else {
      const direction = index > oldIndex ? 1 : -1;
      const thumbWidth = thumbnails[0].offsetWidth;
      const margin = 10;
      const translateX = -(thumbWidth + margin) * direction;

      gsap.to(thumbnails, {
        x: `+=${translateX}`,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          currentSlide = index;
          updateContent(currentSlide);
          updateThumbnailsVisual(currentSlide);
          gsap.set(thumbnails, { x: 0 });
          isAnimating = false;
        },
      });
      loadingBar.classList.remove("active");
      heroImage.classList.remove("show");
      setTimeout(() => {
        heroImage.classList.add("show");
        loadingBar.classList.add("active");
      }, textAnimationDuration);
    }

    resetAutoplay();
  }

  nextBtn.addEventListener("click", () => {
    const nextIndex = (currentSlide + 1) % data.length;
    goToSlide(nextIndex, false);
  });

  prevBtn.addEventListener("click", () => {
    const prevIndex = (currentSlide - 1 + data.length) % data.length;
    goToSlide(prevIndex, false);
  });

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      goToSlide(index, true);
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index, false));
  });

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      const nextIndex = (currentSlide + 1) % data.length;
      goToSlide(nextIndex, false);
    }, transitionTime);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      const nextIndex = (currentSlide + 1) % data.length;
      goToSlide(nextIndex, false);
    } else if (event.key === "ArrowLeft") {
      const prevIndex = (currentSlide - 1 + data.length) % data.length;
      goToSlide(prevIndex, false);
    }
  });

  function init() {
    updateContent(currentSlide);
    updateThumbnailsVisual(currentSlide);
    startAutoplay();
  }

  init();
});
