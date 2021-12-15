"use strict";

//fullpage.js
new fullpage("#fullpage", {
  licenseKey: "1017F7D1-04E34C49-95D45A07-4153FF18",
  lockAnchors: true,
  autoScrolling: true,
  scrollHorizontally: true,
  navigation: true,
  navigationPosition: "right",
  scrollingSpeed: 500,
  paddingTop: "100px",
  paddingBottom: "50px",
  css3: true,
  easingcss3: "ease",
  scrollOverflow: true,
  fixedElements: "#is-fixed",
  verticalCentered: false
});
const getNavWork = document.getElementById("js-work");
const getNavContact = document.getElementById("js-contact");
getNavWork.addEventListener("click", function () {
  fullpage_api.moveTo(3, 0);
});
getNavContact.addEventListener("click", function () {
  fullpage_api.moveTo(4, 0);
}); //humbergaer menu

const navBtn = document.querySelector(".btn-menu");
const navIcon = document.querySelector(".btn-menu_icon");
const nav = document.querySelector(".header_nav");
const navLabel = document.querySelector(".btn-menu_label");
const mainVisualCatch = document.querySelector(".mainvisual_catch");
const pageLink = document.querySelectorAll(".nav_list_link");

function menuAnime() {
  navIcon.classList.toggle("open");
  nav.classList.toggle("slide");
  navLabel.classList.toggle("active");
  mainVisualCatch.classList.toggle("slide");
}

navBtn.addEventListener("click", function () {
  menuAnime();
});
pageLink.forEach(function (target) {
  target.addEventListener("click", function () {
    menuAnime();
  });
}); //work hover animation

if (document.URL.match(/index/)) {
  //mainvisual vh
  let vh = window.innerHeight;
  document.querySelector(".mainvisual_catch").style.height = "calc(".concat(vh, "px - 150px)");
  document.addEventListener("DOMContentLoaded", function () {
    gsap.set(".preview_box", {
      width: 0
    });
    const images = ["/images/img_work01.png", "/images/img_work02.png", "/images/img_work03.png", "/images/img_work04.png", "/images/img_work05.png", "/images/img_work06.png"]; //loader

    const tlLoder = gsap.timeline({
      defaults: {
        ease: "click.out"
      }
    });
    tlLoder.to(".text", {
      y: "0%",
      duration: 1,
      stagger: 0.25
    });
    tlLoder.to(".slider", {
      y: "-100%",
      duration: 1.5,
      delay: 0.5
    });
    tlLoder.to(".intro", {
      y: "-100%",
      duration: 1
    }, "-=1");
    tlLoder.fromTo("header", {
      opacity: 0
    }, {
      opacity: 1,
      duration: 1
    });
    tlLoder.fromTo(".mainvisual_catch", {
      opacity: 0
    }, {
      opacity: 1,
      duration: 1
    }, "-=1");
    const tl = gsap.timeline();
    const elem = document.querySelectorAll(".work_list_link");
    elem.forEach(function (target) {
      target.addEventListener("mouseover", function () {
        const tl = gsap.timeline();
        tl.to(".preview_box", 1, {
          width: "600px",
          ease: Expo.easeInOut
        });
      });
      target.addEventListener("mouseout", function () {
        const tl = gsap.timeline();
        tl.to(".preview_box", 1, {
          width: "0px",
          ease: Expo.easeInOut
        });
      });
    });
  });
} //スマホ時hover削除


let touch = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

if (touch) {
  try {
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si];
      if (!styleSheet.rules) continue;

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue;

        if (styleSheet.rules[ri].selectorText.match(":hover")) {
          styleSheet.deleteRule(ri);
        }
      }
    }
  } catch (ex) {}
}