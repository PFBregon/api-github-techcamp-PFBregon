const APIURL = 'https://api.github.com/users/'

//variables
let form = document.getElementById('form');
let search = document.getElementById('search');
let main = document.getElementById('main');

async function Datos() {
    try {
        const respuesta = await fetch(`${APIURL}${username}`);
        const datos = await respuesta.json();
        console.log("Datos recibidos:", datos);
    } catch (error) {
        console.error("Hay en error:", error);
}
}

Datos();


async function getUser(username) {
    try {
      const response = await fetch(`${APIURL}${username}`); 
      if (!response.ok) {
        if (response.status === 404) {
          createErrorCard(`El usuario "${username}" no se encuentra en GitHub.`);
        } 
        return;
      }      
      let data = await response.json();

      createUserCard(data);
      getRepository(username);

    } catch (err) {
      createErrorCard('Ha ocurrido un error inesperado.');
      console.error(err);
    }
  }


async function getRepository(username) {
  try {
    let response = await fetch(`${APIURL}${username}/repos?sort=created&per_page=5`);
    
    if (!response.ok) {
      createErrorCard('Problema al recuperar los repositorios.');
      return;
    }
    
    let repository = await response.json(); 
    addReposCard(repository);
  } catch (err) {
    createErrorCard('Se produjo un error inesperado al obtener los repositorios.');
    console.error(err);
  }
}


function createUserCard(user) {
  let cardHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || 'Bio no disponible.'}</p>
        <ul>
          <li><strong>${user.followers}</strong> Seguidores</li>
          <li><strong>${user.following}</strong> Siguiendo</li>
          <li><strong>${user.public_repos}</strong> Repositorios</li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;

  main.innerHTML = cardHTML;
}


function addReposCard(repos) {
  const reposEl = document.getElementById('repos');
  repos.forEach(repo => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.textContent = repo.name;
    reposEl.appendChild(repoEl);
  });
}


function createErrorCard(message) {
  let cardHTML = `
    <div class="card">
      <h1>${message}</h1>
    </div>
  `;
  main.innerHTML = cardHTML;
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  let user = search.value.trim();

  if (user) {
    getUser(user);
    search.value = '';
  }
});