const codeSnipbit = document.getElementById("codeBox")
const NAME = document.getElementById("name")
const AUTHOR = document.getElementById("author")
const AGE = document.getElementById("age")
const ACTIVE = document.getElementById("active")
const BIO = document.getElementById("bio")
const RAND_GIST = document.getElementById("randGists")

function updateMain(code, name, author, age, lastActive, info, lang){
    codeSnipbit.innerHTML =  PR.prettyPrintOne(code, lang);
    NAME.innerText = name;
    AUTHOR.innerText = author;
    AGE.innerText = age;
    ACTIVE.innerText = lastActive; 
    BIO.innerText = info;

    document.querySelector("#name2").innerText = name;
}

async function loadGist(gistId){
    let json = await (await fetch(`https://api.github.com/gists/${gistId}`)).json();
    
    let filename = Object.keys(json['files'])[0];
    let file = json['files'][filename];

    updateMain(
        file['content'], 
        filename, 
        json['owner']['login'],
        timeSince(json['created_at']),
        timeSince(json['updated_at']),
        json['description'],
        file['language']);
    return json
}

async function loadNextGist(){
    if(!RAND_GIST.checked){
        // dont ask, vscode works in mysterious ways
        let gists = await (await (await fetch('gistlist.csv')).text()).split("\n");
        
        // first gist is the header for the csv file
        let gistIndex = parseInt(Math.random()*(gists.length-2))+1;
        let gist = gists[gistIndex].split(',');

        let gistID = gist[0];
        let lang = gist[1];

        loadGist(gistID);
    }else{
        let url = `https://api.github.com/gists/public?per_page=1&page=${parseInt(Math.random()*2999)+1}`;
        console.log(url);
        let gistJSON = await (await fetch(url)).json();
        loadGist(gistJSON[0]['id']);
    }
    
}

function timeSince(MDYt){
    let daysSince = (new Date() - new Date(MDYt)) / (1000 * 3600 * 24)

    if(daysSince <= 7){
        diff = parseInt(daysSince);
        return `${diff} day${diff > 1 ? 's':''}`
    } else if(daysSince <= 30){
        diff = parseInt(daysSince / 7);
        return `${diff} week${diff > 1 ? 's':''}`
    }
    else if(daysSince < 365){
        diff = parseInt(daysSince / 30);
        return `${diff} month${diff > 1 ? 's':''}`
    }
    else{
        diff = parseInt(daysSince / 365);
        return `${diff} year${diff > 1 ? 's':''}`
    }
}

window.addEventListener('load', loadNextGist);

const yay = document.getElementById("yay")
const nay = document.getElementById("nay")

yay.addEventListener('click', ()=>{
    console.log("yay");
    loadNextGist();
})

nay.addEventListener('click', ()=>{
    console.log("nay");
    loadNextGist();
})