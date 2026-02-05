(function () {
  var toggler = document.querySelector(".navbar-toggler");
  var collapse = document.querySelector(".navbar-collapse");
  if (!toggler || !collapse) return;

  toggler.addEventListener("click", function () {
    collapse.classList.toggle("show");
    var expanded = collapse.classList.contains("show");
    toggler.setAttribute("aria-expanded", expanded);
  });
})();
