document.addEventListener("DOMContentLoaded", function () {
  includeHTML(function () {
    const menuBtns = document.querySelectorAll(".project-menu-btn");
    const projects = document.querySelectorAll(".project-list > li");

    function filterProjects(event) {
      const filter = event.target.getAttribute("data-filter");

      menuBtns.forEach((btn) => btn.classList.remove("active"));

      event.target.classList.add("active");

      projects.forEach((project) => {
        if (filter === "all" || project.classList.contains(filter)) {
          project.style.display = "block";
        } else {
          project.style.display = "none";
        }
      });
    }
    menuBtns.forEach((btn) => {
      btn.addEventListener("click", filterProjects);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".sticky-nav .nav-menu > li");
  const articles = document.querySelectorAll(".content-wrap > *");

  // 클릭 이벤트를 설정하여 섹션으로 스크롤
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const target = document.querySelector(targetId);

      if (target) {
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        setActiveNavItem(this);
      }
    });
  });

  // 내비게이션 항목에 active 클래스 설정
  function setActiveNavItem(activeItem) {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
    activeItem.classList.add("active");
  }

  // 사용자 정의 스크롤 위치에 따라 활성화된 섹션 스타일 변경
  window.addEventListener("scroll", function () {
    let current = "";
    const scrollPosition = window.pageYOffset; // 현재 스크롤 위치

    articles.forEach((article) => {
      const articleTop =
        article.getBoundingClientRect().top + window.pageYOffset;
      const articleBottom = articleTop + article.offsetHeight;

      // 스크롤 위치가 섹션의 범위 안에 있는지 확인
      if (
        scrollPosition >= articleTop - 400 &&
        scrollPosition < articleBottom
      ) {
        current = article.getAttribute("id");
      }
    });

    // 내비게이션의 활성화 상태를 업데이트
    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-target") === `#${current}`) {
        item.classList.add("active");
      }
    });

    // 활성화된 섹션에 스타일 적용
    articles.forEach((article) => {
      article.classList.remove("active-section");
      if (article.getAttribute("id") === current) {
        article.classList.add("active-section");
      }
    });
  });
});
