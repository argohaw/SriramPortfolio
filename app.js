var tabLinks = document.getElementsByClassName("tab-links");

var tabContents = document.getElementsByClassName("tab-contents");

function openTab(tabName)
{
    for (var tabLink of tabLinks)
    {
        tabLink.classList.remove("active-link");
    }

    for (var tabContent of tabContents)
    {
        tabContent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabName).classList.add("active-tab");
}

var typed = new Typed(".auto-type", {
    strings: ["Software Engineer", " Software Developer"],
    typeSpeed: 150,
    backSpeed: 150,
    loop: true
});


var sideMenu = document.getElementById("sidemenu");

function openMenu()
{
    sideMenu.style.right = "0";
}

function closeMenu(){
    sideMenu.style.right = "-200px";
}
