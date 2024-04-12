/*
  - MAYBE ADD AUTO REFRESHING FOR COUNTERS AND STATISTICS
*/

document.addEventListener('DOMContentLoaded', function(){
  Array.from(document.getElementById('sidebar-nav').children).forEach(element => {
    if (element.getAttribute('data-pathname') === window.location.pathname) {
      element.classList.add('active')
    }
  });
  if (new URLSearchParams(new URL(window.location.href).search).get('load') === "0") {
    document.body.style.filter = ''
    return
  }
  LoadUsers();
  LoadPlaces();
  LoadGuilds();
  LoadAssets();
  document.body.style.filter = ''
});

function LoadUsers() {
  fetch('https://api.polytoria.com/v1/users/?sort=registeredAt&p=1&limit=3')
    .then(response => response.json())
    .then(data => {
      total = data.total
      data = data.users
      let Milestone = GenerateMilestone(data[0].id)
      document.getElementById('loadUsersBtn').setAttribute('disabled', true)
      document.getElementById('userCount').innerText = (data[0].id).toLocaleString()
      document.getElementById('userCountUntilMilestone').innerText = (Milestone - data[0].id).toLocaleString()
      document.getElementById('userCountMilestone').innerText = Milestone.toLocaleString()
      document.getElementById('bannedUserPercent').innerText = Math.round(100 * (data[0].id - total) / total)
      document.getElementById('realUserCount').innerText = total.toLocaleString()

      let List = document.getElementById('userCountList')
      if (List.children.length > 0) {Array.from(List.children).forEach(element => {element.remove();})}
      data.forEach((user, index) => {
        let Column = document.createElement('div')
        Column.classList = 'col-auto'
        Column.innerHTML = `
        <img src="${user.thumbnail.icon}" width="60" height="60" class="img-fluid img-rounded" style="
          border-radius: 5px;
          position: absolute;
          border: 1px solid #303030;
          padding: 2.5px;
          background: #101010;
        " alt="${user.username} Icon">
        <img src="${user.thumbnail.avatar}" width="175" height="175" class="img-fluid img-rounded" style="
          background: radial-gradient(43.86% 25.7% at 47.5% 77.09%,hsla(0,0%,100%,.19) 0,hsla(0,0%,100%,.11) 50%,hsla(0,0%,100%,0) 100%);
        " alt="${user.username} Avatar">
        <br>
        <h4 style="
          white-space: pre;
          width: 275px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 35px;
          margin-top: 10px;
          margin-bottom: 0px;
        "><small style="vertical-align: top;">${( index +1 )}.</small> <a class="link-reset" href="https://polytoria.com/users/${user.id}" target="_blank">${user.username}</a>
        </h4>
        <small>#${user.id} | ${new Date(user.registeredAt).toLocaleString()}</small>
        `
        List.appendChild(Column)
      });
      setTimeout(function () {
        document.getElementById('loadUsersBtn').removeAttribute('disabled')
      }, 1250)
    })
    .catch(error => console.error(error));
}

function LoadPlaces() {
  fetch('https://polytoria.com/api/places?page=1&search=&genre=all&sort=newest')
    .then(response => response.json())
    .then(data => {
      data = data.data
      document.getElementById('loadPlacesBtn').setAttribute('disabled', true)
      document.getElementById('placeCount').innerText = (data[0].id).toLocaleString()

      let List = document.getElementById('placeCountList')
      if (List.children.length > 0) {Array.from(List.children).forEach(element => {element.remove();})}
      data.forEach((game, index) => {
        // in reality it's 3 but because javascript it's 2
        if (index > 2) {
          return
        }
        let Column = document.createElement('div')
        Column.classList = 'col-auto'
        Column.innerHTML = `
        <img src="${game.iconUrl}" width="175" height="175" class="img-fluid img-rounded">
        <br>
        <h4 style="
          white-space: pre;
          width: 275px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 35px;
          margin-top: 10px;
          margin-bottom: 0px;
        "><small style="vertical-align: top;">${( index +1 )}.</small> <a class="link-reset" href="https://polytoria.com/places/${game.id}" target="_blank">${game.name}</a></h3>
        `
        List.appendChild(Column)
      });
      setTimeout(function () {
        document.getElementById('loadPlacesBtn').removeAttribute('disabled')
      }, 1250)
    })
    .catch(error => console.error(error));
}

function LoadGuilds() {
  fetch('https://api.polytoria.com/v1/guilds')
    .then(response => response.json())
    .then(data => {
      data = data.guilds
      document.getElementById('loadGuildsBtn').setAttribute('disabled', true)
      document.getElementById('guildCount').innerText = (data[0].id).toLocaleString()

      let List = document.getElementById('guildCountList')
      if (List.children.length > 0) {Array.from(List.children).forEach(element => {element.remove();})}
      data.forEach((guild, index) => {
        // in reality it's 3 but because javascript it's 2
        if (index > 2) {
          return
        }
        let Column = document.createElement('div')
        Column.classList = 'col-auto'
        Column.innerHTML = `
        <img src="${guild.thumbnail}" width="85" height="85" class="img-fluid img-rounded" style="
          border-radius: 5px;
          position: absolute;
          margin: 10px;
        " alt="${guild.name} Icon" class="guild-icon">
        <img src="${guild.banner}" width="275" height="275" class="img-fluid img-rounded guild-banner">
        <br>
        <h4 style="
          white-space: pre;
          width: 275px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 35px;
          margin-top: 10px;
          margin-bottom: 0px;
        "><small style="vertical-align: top;">${( index +1 )}.</small> <a class="link-reset" href="https://polytoria.com/guild/${guild.id}" target="_blank">${guild.name}</a></h3>
        `
        List.appendChild(Column)
      });
      setTimeout(function () {
        document.getElementById('loadGuildsBtn').removeAttribute('disabled')
      }, 1250)
    })
    .catch(error => console.error(error));
}

function LoadAssets() {
  fetch('https://api.polytoria.com/v1/store/?types[]=shirt&types[]=pants&types[]=tool&types[]=head&types[]=face&types[]=hat&page=1&limit=3&sort=createdAt')
    .then(response => response.json())
    .then(data_item => {
      data_item = data_item.assets
      document.getElementById('loadAssetsBtn').setAttribute('disabled', true)
      document.getElementById('itemCountTotal').innerText = (data_item[0].id).toLocaleString()

      let List = document.getElementById('assetCountList')
      if (List.children.length > 0) {Array.from(List.children).forEach(element => {element.remove();})}

      data_item.forEach((item, index) => {
        // in reality it's 3 but because javascript it's 2
        if (index > 2) {
          return
        }
        let Column = document.createElement('div')
        Column.classList = 'col-auto'
        Column.innerHTML = `
        <img src="${item.thumbnail}" width="175" height="175" class="img-fluid img-rounded">
        <br>
        <h4 style="
          white-space: pre;
          width: 275px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 35px;
          margin-top: 10px;
          margin-bottom: 0px;
        "><small style="vertical-align: top;">${( index +1 )}.</small> <a class="link-reset" href="https://polytoria.com/store/${item.id}" target="_blank">${item.name}</a> by <a class="link-reset" href="https://polytoria.com/users/${item.creator.id}" target="_blank">${item.creator.name}</h3>
        `
        List.appendChild(Column)
      })

      fetch('https://api.polytoria.com/v1/store/?types[]=decal&types[]=audio&types[]=mesh&page=1&limit=1&sort=createdAt')
        .then(response => response.json())
        .then(data_asset => {
          data_asset = data_asset.assets
          document.getElementById('assetCount').innerText = (data_item[0].id + data_asset[0].id).toLocaleString()
          document.getElementById('assetCountTotal').innerText = (data_asset[0].id).toLocaleString()

          document.getElementById('itemCountPercent').innerText = Math.round(100 * data_item[0].id / (data_item[0].id + data_asset[0].id))
          document.getElementById('assetCountPercent').innerText = Math.round(100 * data_asset[0].id / (data_asset[0].id + data_item[0].id))
        })
        .catch(error => console.error(error));

      setTimeout(function () {
        document.getElementById('loadAssetsBtn').removeAttribute('disabled')
      }, 1250)
    })
    .catch(error => console.error(error));
}

// Generated by AI cause I'm lazy
function GenerateMilestone(number) {
  // Get the digit in the hundreds place.
  var hundredsDigit = number % 1000;

  // If the hundreds digit is less than 5, round down to the nearest 10 thousand.
  if (hundredsDigit < 5) {
    return Math.floor(number / 10000) * 10000;
  } else {
    // If the hundreds digit is greater than or equal to 5, round up to the next 10 thousand.
    return Math.ceil(number / 10000) * 10000;
  }
}