// 프로젝트에 따른 링크 설정
const projectLinks = {
  1: "https://jhlee8596.github.io/casper/",
  2: "https://jhlee8596.github.io/ssuni/",
  3: "https://jhlee8596.github.io/calculating/",
  4: "https://jhlee8596.github.io/d-day/",
  5: "https://jhlee8596.github.io/todo-list/",
  6: "https://jhlee8596.github.io/korea-edu/theme/basic/",
  7: "https://jhlee8596.github.io/monami/",
};

function openModal(projectNum) {
  // Ensure modal elements are available
  let modal = document.getElementById("myModal");
  let modalContent = document.querySelector(".modal-cont");
  let modalHead = document.querySelector(".modal-head");

  if (!modal || !modalContent || !modalHead) {
    console.error("Modal elements are missing.");
    return;
  }

  // Set attributes to load content
  modalHead.setAttribute(
    "include-html",
    `./layout/modal/head/head${projectNum}.html`
  );
  modalContent.setAttribute(
    "include-html",
    `./layout/modal/contents/modal${projectNum}.html`
  );

  let homepageURL = projectLinks[projectNum];
  let btnHomepage = document.getElementById("btn-homepage");
  if (btnHomepage) {
    btnHomepage.href = homepageURL;
  }

  // Load modal content
  includeHTML(function () {
    modalShow(function () {
      if (modal) {
        modal.style.display = "block";
      }
      document.body.classList.add("no-scroll"); // Prevent scrolling
      initializeImageModal(); // Initialize image modal
    });
  });

  // Setup close button
  let closeBtn = document.getElementsByClassName("modal-close-btn")[0];
  if (closeBtn) {
    closeBtn.onclick = function () {
      if (modal) {
        modal.style.display = "none";
      }
      document.body.classList.remove("no-scroll"); // Enable scrolling
    };
  }
}

function modalShow(callback) {
  let elements = document.querySelectorAll("[include-html]");
  if (elements.length === 0) {
    if (callback) callback();
    return;
  }

  elements.forEach((element) => {
    let file = element.getAttribute("include-html");
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          element.innerHTML = this.responseText;
        }
        if (this.status == 404) {
          element.innerHTML = "Page not found.";
        }
        element.removeAttribute("include-html");
        // Check if all elements are processed
        if (
          document.querySelectorAll("[include-html]").length === 0 &&
          callback
        ) {
          callback();
        }
      }
    };
    xhr.open("GET", file, true);
    xhr.send();
  });
}

// 이미지 모달 스크립트
function initializeImageModal() {
  // 이미지 모달, 모달 이미지, 모달 정보, 버튼 요소를 가져옵니다.
  const imageModal = document.getElementById("image-modal");
  const modalImageElement = document.getElementById("modal-image");
  const modalInfoElement = document.querySelector(".modal-info");
  const closeImageModalButton = document.querySelector(".close-img-btn");
  const fullScreenButton = document.querySelector(".img-full-btn");
  const prevImageButton = document.querySelector(".prev-img-btn");
  const nextImageButton = document.querySelector(".next-img-btn");
  const imgWrap = document.querySelector(".modal-body");

  // 갤러리 이미지 리스트를 가져오고 현재 이미지 인덱스를 초기화합니다.
  let imageList = Array.from(document.querySelectorAll(".gallery-img"));
  let currentImageIndex = 0;
  let isImageFullScreen = false; // 현재 전체화면 여부를 나타내는 변수
  const originalStyles = {
    // 원래 스타일을 저장하는 객체
    modal: { padding: "", height: "" },
    imgWrap: "",
    modalImage: "",
  };

  // 요소가 존재할 때만 원래 스타일을 가져옵니다.
  if (imageModal) {
    const modalStyles = window.getComputedStyle(imageModal);
    originalStyles.modal.padding = modalStyles.padding;
    originalStyles.modal.height = modalStyles.height;
  }

  if (imgWrap) {
    originalStyles.imgWrap = window.getComputedStyle(imgWrap).height;
  }

  if (modalImageElement) {
    originalStyles.modalImage =
      window.getComputedStyle(modalImageElement).height;
  }

  // 이미지 모달을 열고 현재 이미지와 버튼 상태를 업데이트합니다.
  function openImageModal(index) {
    currentImageIndex = index;
    if (imageModal) {
      imageModal.style.display = "block"; // 모달을 보이게 합니다.
    }
    if (modalImageElement) {
      modalImageElement.src = imageList[currentImageIndex].src; // 현재 이미지의 소스를 설정합니다.
    }
    updateImageButtons(); // 이전/다음 버튼 상태를 업데이트합니다.
    displayModalInfo(); // 모달 정보를 표시합니다.
  }

  // 이미지 모달을 닫고 전체화면 모드를 종료합니다.
  function closeImageModal() {
    if (imageModal) {
      imageModal.style.display = "none"; // 모달을 숨깁니다.
    }
    exitFullscreen(); // 전체화면 모드를 종료합니다.
  }

  // 모달 정보를 표시하고 3초 후에 사라지게 합니다.
  function displayModalInfo() {
    if (modalInfoElement) {
      modalInfoElement.style.opacity = "1"; // 정보를 보이게 합니다.
      modalInfoElement.style.transition = "opacity 0.5s"; // 투명도 변경 애니메이션을 설정합니다.
      setTimeout(() => {
        modalInfoElement.style.opacity = "0"; // 3초 후에 정보를 숨깁니다.
      }, 3000);
    }
  }

  // 모달 정보를 즉시 숨깁니다.
  function hideModalInfoImmediately() {
    if (modalInfoElement) {
      modalInfoElement.style.opacity = "0"; // 정보를 즉시 숨깁니다.
      modalInfoElement.style.transition = "none"; // 애니메이션을 제거합니다.
    }
  }

  // 전체화면 모드를 토글합니다.
  function toggleImageFullScreen() {
    if (isImageFullScreen) {
      exitFullscreen(); // 현재 전체화면이면 종료합니다.
    } else {
      enterFullscreen(imageModal); // 현재 전체화면이 아니면 전체화면으로 전환합니다.
    }
  }

  // 주어진 요소를 전체화면 모드로 전환합니다.
  function enterFullscreen(element) {
    const fullscreenMethods = [
      "requestFullscreen", // 표준 전체화면 메소드
      "mozRequestFullScreen", // Firefox
      "webkitRequestFullscreen", // Chrome, Safari, Opera
      "msRequestFullscreen", // IE/Edge
    ];

    // 가능한 전체화면 메소드를 호출합니다.
    for (const method of fullscreenMethods) {
      if (element[method]) {
        element[method]();
        break;
      }
    }

    setModalFullscreenStyles(); // 전체화면 스타일을 적용합니다.
    if (fullScreenButton) {
      fullScreenButton
        .querySelector("i")
        .classList.replace("fa-expand", "fa-compress"); // 버튼 아이콘을 변경합니다.
    }
    isImageFullScreen = true; // 전체화면 상태를 업데이트합니다.
    hideModalInfoImmediately(); // 전체화면 모드에서 정보를 즉시 숨깁니다.
  }

  // 전체화면 모드를 종료합니다.
  function exitFullscreen() {
    const exitFullscreenMethods = [
      "exitFullscreen", // 표준 전체화면 종료 메소드
      "mozCancelFullScreen", // Firefox
      "webkitExitFullscreen", // Chrome, Safari, Opera
      "msExitFullscreen", // IE/Edge
    ];

    // 현재 전체화면 모드인 경우에만 종료를 시도합니다.
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      for (const method of exitFullscreenMethods) {
        if (document[method]) {
          document[method]();
          break;
        }
      }
    }

    restoreModalStyles(); // 원래 스타일로 복원합니다.
    if (fullScreenButton) {
      fullScreenButton
        .querySelector("i")
        .classList.replace("fa-compress", "fa-expand"); // 버튼 아이콘을 변경합니다.
    }
    isImageFullScreen = false; // 전체화면 상태를 업데이트합니다.
  }

  // 전체화면 상태에서 모달의 스타일을 설정합니다.
  function setModalFullscreenStyles() {
    if (imageModal) {
      imageModal.style.padding = "0"; // 패딩을 0으로 설정합니다.
      imageModal.style.height = "100%"; // 높이를 100%로 설정합니다.
    }
    if (imgWrap) {
      imgWrap.style.height = "100%"; // 이미지 랩의 높이를 100%로 설정합니다.
    }
    if (modalImageElement) {
      modalImageElement.style.height = "100%"; // 모달 이미지의 높이를 100%로 설정합니다.
      modalImageElement.style.objectFit = "cover"; // 이미지를 잘라서 모달을 채우게 합니다.
    }
  }

  // 전체화면 종료 후 모달의 스타일을 원래대로 복원합니다.
  function restoreModalStyles() {
    if (imageModal) {
      Object.assign(imageModal.style, originalStyles.modal); // 원래의 패딩과 높이를 복원합니다.
    }
    if (imgWrap) {
      imgWrap.style.height = originalStyles.imgWrap; // 원래의 높이를 복원합니다.
    }
    if (modalImageElement) {
      modalImageElement.style.height = originalStyles.modalImage; // 원래의 높이를 복원합니다.
    }
  }

  // 이전 이미지를 보여줍니다.
  function showPreviousImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      if (modalImageElement) {
        modalImageElement.src = imageList[currentImageIndex].src; // 이전 이미지의 소스를 설정합니다.
      }
      updateImageButtons(); // 버튼 상태를 업데이트합니다.
    }
  }

  // 다음 이미지를 보여줍니다.
  function showNextImage() {
    if (currentImageIndex < imageList.length - 1) {
      currentImageIndex++;
      if (modalImageElement) {
        modalImageElement.src = imageList[currentImageIndex].src; // 다음 이미지의 소스를 설정합니다.
      }
      updateImageButtons(); // 버튼 상태를 업데이트합니다.
    }
  }

  // 이전/다음 이미지 버튼의 표시 상태를 업데이트합니다.
  function updateImageButtons() {
    if (prevImageButton) {
      prevImageButton.style.display =
        currentImageIndex === 0 ? "none" : "block"; // 첫 번째 이미지에서는 이전 버튼을 숨깁니다.
    }
    if (nextImageButton) {
      nextImageButton.style.display =
        currentImageIndex === imageList.length - 1 ? "none" : "block"; // 마지막 이미지에서는 다음 버튼을 숨깁니다.
    }
  }

  // ESC 키를 눌렀을 때 모달을 닫습니다.
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      closeImageModal();
    }
  }

  // 이벤트 리스너를 설정합니다.
  function setupEventListeners() {
    imageList.forEach((img, index) => {
      img.addEventListener("click", () => openImageModal(index)); // 갤러리 이미지를 클릭하면 모달을 엽니다.
    });

    if (closeImageModalButton) {
      closeImageModalButton.addEventListener("click", closeImageModal); // 모달 닫기 버튼을 클릭하면 모달을 닫습니다.
    }

    if (fullScreenButton) {
      fullScreenButton.addEventListener("click", toggleImageFullScreen); // 전체화면 버튼을 클릭하면 전체화면을 토글합니다.
    }

    if (prevImageButton) {
      prevImageButton.addEventListener("click", showPreviousImage); // 이전 이미지 버튼을 클릭하면 이전 이미지를 보여줍니다.
    }

    if (nextImageButton) {
      nextImageButton.addEventListener("click", showNextImage); // 다음 이미지 버튼을 클릭하면 다음 이미지를 보여줍니다.
    }

    if (imageModal) {
      window.addEventListener("click", (event) => {
        if (event.target === imageModal) {
          closeImageModal(); // 모달 영역 외부를 클릭하면 모달을 닫습니다.
        }
      });
    }

    document.addEventListener("keydown", handleKeyDown); // 키보드 입력을 처리합니다.

    // 전체화면 모드 상태가 변경될 때 전체화면 모드를 종료합니다.
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        exitFullscreen();
      }
    });
  }

  setupEventListeners(); // 이벤트 리스너를 설정합니다.
}

// DOM이 로드된 후에 모달을 초기화합니다.
document.addEventListener("DOMContentLoaded", initializeImageModal);
