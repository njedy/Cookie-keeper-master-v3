// ==UserScript==
// @name         Temporary Cookie Generator
// @namespace    <http://tampermonkey.net/>
// @version      3
// @description  Generates a temporary cookie for the user based on the time chosen, and allows for selecting and transferring cookies from another browser and editing them, as well as automatic cookie deletion and user account creation for cookie storage and management (optional)
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function generateCookie(hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
        document.cookie = "myCookie=cookieValue" + expires + "; path=/";
        alert("Cookie generated for " + hours + " hours.");
    }

    var button = document.createElement('button');
    button.innerHTML = 'Generate Cookie';
    button.onclick = function() {
        var hours = prompt("Enter number of hours for cookie to last:");
        generateCookie(hours);
    };
    document.body.appendChild(button);

    var donateButton = document.createElement('button');
    donateButton.innerHTML = 'Donate';
    donateButton.style.backgroundColor = '#008CBA';
    donateButton.style.color = 'white';
    donateButton.style.padding = '10px 20px';
    donateButton.style.border = 'none';
    donateButton.style.borderRadius = '5px';
    donateButton.style.fontSize = '16px';
    donateButton.style.fontWeight = 'bold';
    donateButton.onclick = function() {
        window.open('<https://example.com/donate>');
    };
    document.body.appendChild(donateButton);

    var cookieTable = document.createElement('table');
    cookieTable.style.border = '1px solid black';
    cookieTable.style.marginTop = '20px';
    cookieTable.style.marginBottom = '20px';

    var cookieHeader = cookieTable.createTHead();
    var cookieRow = cookieHeader.insertRow(0);
    var cookieName = cookieRow.insertCell(0);
    var cookieValue = cookieRow.insertCell(1);
    var cookieExpires = cookieRow.insertCell(2);
    var cookiePath = cookieRow.insertCell(3);
    cookieName.innerHTML = 'Name';
    cookieValue.innerHTML = 'Value';
    cookieExpires.innerHTML = 'Expires';
    cookiePath.innerHTML = 'Path';

    var cookieBody = cookieTable.createTBody();
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        var cookieRow = cookieBody.insertRow(i);
        var cookieName = cookieRow.insertCell(0);
        var cookieValue = cookieRow.insertCell(1);
        var cookieExpires = cookieRow.insertCell(2);
        var cookiePath = cookieRow.insertCell(3);
        var cookieData = cookie.split('=');
        cookieName.innerHTML = cookieData[0];
        cookieValue.innerHTML = cookieData[1];
        cookieExpires.innerHTML = new Date(Date.now() + 864e5).toUTCString();
        cookiePath.innerHTML = '/';
    }

    var transferButton = document.createElement('button');
    transferButton.innerHTML = 'Transfer Cookies';
    transferButton.onclick = function() {
        var cookies = prompt('Enter cookies to transfer (in format "cookie1=value1; cookie2=value2; ...")');
        document.cookie = cookies;
        location.reload();
    };
    document.body.appendChild(transferButton);

    document.body.appendChild(cookieTable);

    // Automatic cookie deletion
    var deleteCookies = function() {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            var cookieData = cookie.split('=');
            var expires = new Date(Date.now() - 864e5).toUTCString();
            document.cookie = cookieData[0] + '=; expires=' + expires + '; path=/';
        }
        alert('Cookies have been deleted.');
    };
    setTimeout(deleteCookies, 86400000); // delete cookies after 24 hours

    // User account creation and cookie storage
    var createAccountButton = document.createElement('button');
    createAccountButton.innerHTML = 'Create Account';
    createAccountButton.onclick = function() {
        var username = prompt('Enter username:');
        var password = prompt('Enter password:');
        GM_setValue('username', username);
        GM_setValue('password', password);
        alert('Account created successfully.');
    };
    document.body.appendChild(createAccountButton);

    var userCookieTable = document.createElement('table');
    userCookieTable.style.border = '1px solid black';
    userCookieTable.style.marginTop = '20px';
    userCookieTable.style.marginBottom = '20px';

    var userCookieHeader = userCookieTable.createTHead();
    var userCookieRow = userCookieHeader.insertRow(0);
    var userCookieName = userCookieRow.insertCell(0);
    var userCookieValue = userCookieRow.insertCell(1);
    var userCookieExpires = userCookieRow.insertCell(2);
    var userCookiePath = userCookieRow.insertCell(3);
    userCookieName.innerHTML = 'Name';
    userCookieValue.innerHTML = 'Value';
    userCookieExpires.innerHTML = 'Expires';
    userCookiePath.innerHTML = 'Path';

    var userCookieBody = userCookieTable.createTBody();
    var userCookies = GM_getValue('cookies', []);
    for (var i = 0; i < userCookies.length; i++) {
        var cookie = userCookies[i];
        var cookieRow = userCookieBody.insertRow(i);
        var cookieName = cookieRow.insertCell(0);
        var cookieValue = cookieRow.insertCell(1);
        var cookieExpires = cookieRow.insertCell(2);
        var cookiePath = cookieRow.insertCell(3);
        var cookieData = cookie.split('=');
        cookieName.innerHTML = cookieData[0];
        cookieValue.innerHTML = cookieData[1];
        cookieExpires.innerHTML = new Date(Date.now() + 864e5).toUTCString();
        cookiePath.innerHTML = '/';
    }

    var saveCookieButton = document.createElement('button');
    saveCookieButton.innerHTML = 'Save Cookie';
    saveCookieButton.onclick = function() {
        var cookie = prompt('Enter cookie to save (in format "cookie=value"):');
        var userCookies = GM_getValue('cookies', []);
        userCookies.push(cookie);
        GM_setValue('cookies', userCookies);
        alert('Cookie saved successfully.');
        location.reload();
    };
    document.body.appendChild(saveCookieButton);

    var clearCookiesButton = document.createElement('button');
    clearCookiesButton.innerHTML = 'Clear Cookies';
    clearCookiesButton.onclick = function() {
        GM_setValue('cookies', []);
        alert('Cookies cleared successfully.');
        location.reload();
    };
    document.body.appendChild(clearCookiesButton);

    var username = GM_getValue('username', null);
    var password = GM_getValue('password', null);
    if (username && password) {
        var loginButton = document.createElement('button');
        loginButton.innerHTML = 'Login';
        loginButton.onclick = function() {
            var enteredUsername = prompt('Enter username:');
            var enteredPassword = prompt('Enter password:');
            if (enteredUsername === username && enteredPassword === password) {
                alert('Login successful.');
                document.body.appendChild(userCookieTable);
            } else {
                alert('Incorrect username or password.');
            }
        };
        document.body.appendChild(loginButton);
    }

    // Dark mode
    var darkModeButton = document.createElement('button');
    darkModeButton.innerHTML = 'Dark Mode';
    darkModeButton.onclick = function() {
        var body = document.getElementsByTagName('body')[0];
        body.style.backgroundColor = '#333';
        body.style.color = '#fff';
        button.style.backgroundColor = '#008CBA';
        transferButton.style.backgroundColor = '#008CBA';
        saveCookieButton.style.backgroundColor = '#008CBA';
        clearCookiesButton.style.backgroundColor = '#008CBA';
        createAccountButton.style.backgroundColor = '#008CBA';
        userCookieTable.style.border = '1px solid white';
        userCookieTable.style.color = '#fff';
        userCookieTable.style.backgroundColor = '#333';
        cookieTable.style.border = '1px solid white';
        cookieTable.style.color = '#fff';
        cookieTable.style.backgroundColor = '#333';
    };
    document.body.appendChild(darkModeButton);

})();

