// include.js

function includeHTML(callback) {
    var z, i, elmnt, file, xhr;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("include-html");
        if (file) {
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    elmnt.removeAttribute("include-html");
                    includeHTML(callback); // Continue to next element
                }
            };
            xhr.open("GET", file, true);
            xhr.send();
            return;
        }
    }
    // All elements processed
    if (callback) callback();
}