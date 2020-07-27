let globalUsers = [];
let globalFilterUsers = [];
let inputName = document.getElementById('inputPeopleName');

async function start(){
    await promiseFecthUsers();

    hideSpinner();
    render();
}

async function fecthUsers(){
    let response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    let json = await response.json();
    
    globalUsers = json.results.map(({name, gender, picture, dob}) => {
        return{
            userName: `${name.first} ${name.last}`,
            userGender: gender,
            userPicture: picture.thumbnail,
            userAge: dob.age
        }
    });

    globalFilterUsers = globalUsers;
}

function promiseFecthUsers(){
    let divSearch = document.getElementById('divSearch');
    divSearch.classList.add('hide');
    
    return new Promise(async(resolve, reject) => {
        const user = await fecthUsers();
        setTimeout(() => {
            resolve(user);
            divSearch.classList.remove('hide');
        }, 3000);
    });
}

function loadData(){
    let inicialDescriptionUser = document.getElementById('userListTitle');
    let inicialDescriptionDetaila = document.getElementById('detailListTitle');
    let tabUser = document.getElementById('tabUsers');
    let tabDetails = document.getElementById('tabDetails');
    
    if(inputName.value.length > 0){
        inicialDescriptionUser.innerHTML = "";
        inicialDescriptionDetaila.innerHTML = "";
    
        const totalAges = globalFilterUsers.reduce((accumulatorAges, user) => {
            return accumulatorAges += user.userAge;
        }, 0);

        const mediaAges = globalFilterUsers.reduce((accumulatorAges, user) => {
            return accumulatorAges += user.userAge / globalFilterUsers.length;
        }, 0);

        let totalFemale = 0;
        let totalMale = 0;
        
        tabUser.innerHTML = `
            <h3> Total de Usuários: ${globalFilterUsers.length} </h3>
            ${globalFilterUsers.map(({userName, userPicture, userGender, userAge}) => {
                if(userGender === 'female'){
                    totalFemale++;
                } else {
                    totalMale++;
                }
                return `
                    <div class='flex-row'>
                        <img src='${userPicture}' alt='${userName}' class='image'/>
                        <span>${userName}, ${userAge} anos</span>
                    </div>        
                `
            }).join('')}
        `
        tabDetails.innerHTML = `
            <h3>Estatísticas:</h3>
            <p>Sexo masculino: ${totalMale}</p> 
            <p>Sexo feminino: ${totalFemale}</p>
            <p>Soma das idades: ${totalAges}</p>
            <p>Média das idades: ${mediaAges}</p>
        `
    } else {
        inicialDescriptionUser.innerHTML = "Nenhum usuário filtrado.";
        inicialDescriptionDetaila.innerHTML = "Nada a ser exibido.";
        tabUser.innerHTML = '';
        tabDetails.innerHTML = '';
    }
}

function hideSpinner(){
    let spinner = document.getElementById('spinner');
    spinner.classList.add('hide');
}

function render(){
    let btnSearch = document.getElementById('btnSearch');
    btnSearch.addEventListener('click', handleSearchItems);    
   
    function handleSearchItems(){
        const filterValue = inputName.value.toLowerCase().trim(); //TRIM: Remove espaçamentos.
        globalFilterUsers = globalUsers.filter(item => {
            return item.userName.toLowerCase().includes(filterValue);
        });
        loadData();
    }
}

start();