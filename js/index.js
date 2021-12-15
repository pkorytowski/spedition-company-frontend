
const login = () => {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    if (login === "admin" && password === "admin") {
        sessionStorage.setItem("logged", "true")
        window.location.href="main_page.html";
    }
}

const logout = () => {
    sessionStorage.removeItem("logged");
    window.location.href="index.html";
}

const displayLoginForm = () => {
    if (sessionStorage.getItem("logged") == null) {
        document.getElementById("contentContainer").innerHTML = `
        <div class="wrapper fadeInDown">
            <div id="formContent">
                <h3>Zaloguj się</h3>
                <!-- Login Form -->
                <form>
                    <input type="text" id="login" class="fadeIn second" name="login" placeholder="login">
                    <input type="text" id="password" class="fadeIn third" name="login" placeholder="password">
                    <input type="submit" id="loginBtn" class="fadeIn fourth" value="Log In">
                </form>
            </div>
        </div>
        `;
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.addEventListener("click", login)
    } else {
        window.location.href="main_page.html";
    }
}

const displayCities = () => {
    let data = [];
    getData('/cities').then(res => {
        for (let i=0; i<res.length; i++) {
            data.push(res[i]);
        }
        let str = '';
        str += '<table class="table-striped">';
        str += '<tr><td>Miasto</td><td>Bezpośrednie połączenie</td><td>Odległość [h]</td></tr>';
        for(let i=0; i<data.length; i++) {
            str += '<tr>'
            str += '<td>'+data[i].city.name+'</td>';
            str += '<td colspan="2"><table class="table-striped" style="width:100%; text-align: center">';
            for(let j=0; j<data[i].relationships.length; j++){
                str += '<tr>';
                str += '<td>'+data[i].relationships[j].city.name+'</td>';
                str += '<td>'+data[i].relationships[j].distance+'</td>';
                str += '</tr>';
            }
            str += "</table>"
            str += '</td>';
            str += '</tr>';
        }
        str += '</table>';

        let content = document.getElementById("content");
        content.innerHTML = str;
    });
}

const displayFreights = () => {
    let data = [];
    getData('/freights').then(res => {
        for (let i=0; i<res.length; i++) {
            data.push(res[i]);
        }
        let str = '';
        str += '<table class="table-striped">';
        str += '<tr><td>Nazwa</td><td>Wartość</td><td>Z</td><td>Do</td></tr>';
        for(let i=0; i<data.length; i++) {
            str += '<tr>'
            str += '<td>'+data[i].name+'</td>';
            str += '<td>'+data[i].value+'</td>';
            str += '<td>'+data[i].start.name+'</td>';
            str += '<td>'+data[i].end.name+'</td>';
            str += '</tr>';
        }
        str += '</table>';

        let content = document.getElementById("content");
        content.innerHTML = str;
    });
}

const displayAddFreights = () => {
    let data = [];
    let content = document.getElementById("content");

    getData('/cities').then(res => {
        for (let i=0; i<res.length; i++) {
            data.push(res[i]);
        }
        let options = '';
        for(let i=0; i<data.length; i++) {
            options += '<option>'+data[i].city.name+'</option>'
        }

        content.innerHTML = `
        <form>
            <div class="form-group">
                <label for="freightName">Name</label>
                <input type="text" class="form-control" id="freightName"/>
            </div>
            <div class="form-group">
                <label for="freightValue">Value</label>
                <input type="number" class="form-control" id="freightValue" value="0"/>
            </div>
            <div class="form-group">
                <label for="fromNode">From</label>
                <select class="form-control" id="fromNode">`+options+`</select>
            </div>
            <div class="form-group">
                <label for="toNode">To</label>
                <select class="form-control" id="toNode">`+options+`</select>
            </div>
        </form>
        <button class="btn btn-primary" id="addFreightBtn">Submit</button>
        `;
        let addBtn = document.getElementById("addFreightBtn");
        addBtn.addEventListener("click", addFreight)
    });
}

const addFreight = () => {
    let name = document.getElementById("freightName").value;
    let value = document.getElementById("freightValue").value;
    let fromNode = document.getElementById("fromNode").value;
    let toNode = document.getElementById("toNode").value;

    if (fromNode === toNode) {
        alert("Trasa nie może zaczynać i kończyć się w tym samym miejscu");
    } else {
        if (value < 0) {
            alert("Wartość nie może być ujemna")
        } else {
            data = {
                name: name,
                value: value,
                from: fromNode,
                to: toNode
            }
            postData("/freight", data).then(response => {
                if(response.ok){
                    alert("Dodano");
                } else {
                    alert("Wystąpił błąd");
                }
            });
        }
    }
}

const url = 'http://localhost:5000';

async function getData(path=''){
    let addr = url + path;
    const response = await fetch(addr, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        headers: {
            'Access-Control-Allow-Origin': url,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body data type must match "Content-Type" header
    });
    return await response.json();
}

async function getDataWithParams(path='', data){
    let addr = url + path;
    let urladdr = new URL(addr);
    urladdr.search = data;
    const response = await fetch(urladdr, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        headers: {
            'Access-Control-Allow-Origin': url,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body data type must match "Content-Type" header
    });
    return await response.json();
}

async function postData(path = '', data = {}) {
    let addr = url + path;
    const response = await fetch(addr, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': url,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
    // parses JSON response into native JavaScript objects
}

