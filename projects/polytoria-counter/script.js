document.addEventListener('DOMContentLoaded', function(){
  Array.from(document.getElementById('sidebar-nav').children).forEach(element => {
    if (element.getAttribute('data-pathname') === window.location.pathname) {
      element.classList.add('active')
    }
  });
  if (new URLSearchParams(window.location.search).get('load') === "false") {
    document.body.style.filter = ''
    return
  }
  LoadUsers();
  LoadPlaces();
  LoadGuilds();
  LoadAssets();
  document.body.style.filter = ''

  if (new URLSearchParams(window.location.search).get('autoRefreshUsers') === "true") {
    setInterval(() => {
      console.log('REFRESH AUTOMATICALLY')
      LoadUsers();
      //LoadPlaces();
      //LoadGuilds();
      //LoadAssets();
    }, 2000);
  }
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
        <small>#${user.id.toLocaleString()} | ${new Date(user.registeredAt).getHours()}:${new Date(user.registeredAt).getMinutes()} ${ (new Date(user.registeredAt).getHours() < 12) ? 'AM' : 'PM' }</small>
        `
        List.appendChild(Column)
      });
      setTimeout(function () {
        document.getElementById('loadUsersBtn').removeAttribute('disabled')
      }, 1250)

      //console.log('[USERS] ' + Requests + ' request(s) in ' + new Date().getTime()-Start + 'ms')
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
        <img src="${ (guild.banner !== "https://c0.ptacdn.com/guilds/banners/default.png") ? guild.banner : 'default-guild-banner.png' }" width="275" height="275" class="img-fluid img-rounded guild-banner" ${ (guild.banner === "https://c0.ptacdn.com/guilds/banners/default.png") ? `style="background-color: #${guild.color}"` : '' }>
        <br>
        <h4 style="
          white-space: pre;
          width: 275px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 35px;
          margin-top: 10px;
          margin-bottom: 0px;
        "><small style="vertical-align: top;">${( index +1 )}.</small> <a class="link-reset" href="https://polytoria.com/guilds/${guild.id}" target="_blank">${guild.name}</a></h3>
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
        "><small style="vertical-align: top;">${( index +1 )}.</small> <a class="link-reset" href="https://polytoria.com/store/${item.id}" target="_blank">${item.name}</a> by <a class="link-reset" href="https://polytoria.com/users/${item.creator.id}" target="_blank">${item.creator.name}</a></h3>
        `
        List.appendChild(Column)
      })

      fetch('https://api.polytoria.com/v1/store/?types[]=decal&types[]=audio&types[]=mesh&page=1&limit=1&sort=createdAt')
        .then(response => response.json())
        .then(data_asset => {
          data_asset = data_asset.assets
          document.getElementById('assetCount').innerText = (data_item[0].id + data_asset[0].id).toLocaleString()
          document.getElementById('assetCountTotal').innerText = (data_asset[0].id).toLocaleString()

          /*
          document.getElementById('itemCountPercent').innerText = Math.round(100 * data_item[0].id / (data_item[0].id + data_asset[0].id))
          document.getElementById('assetCountPercent').innerText = Math.round(100 * data_asset[0].id / (data_asset[0].id + data_item[0].id))
          */
        })
        .catch(error => console.error(error));

      setTimeout(function () {
        document.getElementById('loadAssetsBtn').removeAttribute('disabled')
      }, 1250)
    })
    .catch(error => console.error(error));
}

async function CountAchievements(username, excludeBadgeWalks) {
  requests = 1
  const BadgeWalkPlaces = [8856, 8859]
  const UserID = (await (await fetch('https://api.polytoria.com/v1/users/find?username=' + username)).json()).id
  let Achievements = {
    recent: null,
    total: 0,
    pages: 1,
  }

  requests++
  
  let AchievementData;
  if (excludeBadgeWalks === false) {
    AchievementData = (await (await fetch('https://api.polytoria.com/v1/users/' + UserID + '/inventory?type=achievement&limit=100')).json())
    Achievements.recent = AchievementData.inventory.splice(0, 3)
    Achievements.total = AchievementData.total
    Achievements.pages = AchievementData.pages

    document.getElementById('achievement-badge-walk-message').remove()
  } else {
    console.log('excluded')
    let BadgeWalkAchievements = {
      badges: [],
      pages: {}
    }
    requests++
    requests++
    
    requests++
    AchievementData = (await (await fetch('https://api.polytoria.com/v1/users/' + UserID + '/inventory?type=achievement&limit=100')).json())
    let ActualAchievements = {
      achievements: [],
      total: 0
    }
    const Cache = window.localStorage.getItem('poly-badgeWalkIDs')
    const RightNow = new Date()
    if (Cache === null || (RightNow.getFullYear() !== new Date(Cache.requested).getFullYear()) || (RightNow.getMonth() !== new Date(Cache.requested).getMonth()) || (RightNow.getDate() !== new Date(Cache.requested).getDate()) || (RightNow.getHours() !== new Date(Cache.requested).getHours())) {
      for (let place of BadgeWalkPlaces) {
        const Initial = await (await fetch('https://api.polytoria.com/v1/places/' + place + '/achievements?limit=100')).json()

        BadgeWalkAchievements.badges.push(...Initial.achievements.map((x) => x.asset.id))
        BadgeWalkAchievements.pages[place] = Initial.pages

        if (AchievementData.pages <= 8) {
          console.log('min pages')
          for (let page = 1; page < BadgeWalkAchievements.pages[place]; page++) {
            requests++
            const PageResult = await (await fetch('https://api.polytoria.com/v1/places/' + place + '/achievements?limit=100&page=' + (page+1))).json()
            BadgeWalkAchievements.badges.push(...PageResult.achievements.map((x) => x.asset.id))
          }
        }

        console.log('finished achievement fetching for ' + place)
      }

      console.log('finished & cached')

      window.localStorage.setItem('poly-badgeWalkIDs', JSON.stringify({
        data: BadgeWalkAchievements,
        requested: new Date().getTime()
      }))
    } else {
      BadgeWalkAchievements = JSON.parse(window.localStorage.getItem('poly-badgeWalkIDs')).data
    }

    const InitialNotExcludedAchievements = AchievementData.inventory.filter((x) => BadgeWalkAchievements.badges.indexOf(x.asset.id) === -1 )
    ActualAchievements.achievements.push(...InitialNotExcludedAchievements)
    ActualAchievements.total += [...InitialNotExcludedAchievements].length

    for (let page = 1; page < AchievementData.pages; page++) {
      requests++
      const PageResult = await (await fetch('https://api.polytoria.com/v1/users/' + UserID + '/inventory?type=achievement&limit=100&page=' + (page+1))).json()
      const NotExcludedAchievements = PageResult.inventory.filter((x) => BadgeWalkAchievements.badges.indexOf(x.asset.id) === -1 )
      ActualAchievements.achievements.push(...NotExcludedAchievements)
      ActualAchievements.total += [...NotExcludedAchievements].length
    }

    console.log(ActualAchievements)
    console.log('---')
    console.log(BadgeWalkAchievements)

    Achievements.recent = ActualAchievements.achievements.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt)).splice(0, 3)
    Achievements.total = ActualAchievements.total
  }

  console.log(requests)

  document.getElementById('achievement-1').remove()
  document.getElementById('achievement-2').style.display = 'block'

  document.getElementById('achievementTitle').innerText = username + "'s Achievements"
  document.getElementById('achievementCount').innerText = Achievements.total.toLocaleString()

  document.getElementById('achievement-badge-walk-message').innerHTML = `* excluding badge walk games or games of similar variety<br><span style="font-size:0.7rem;">${ (100-(Achievements.total * 100) / AchievementData.total).toFixed(2) }% from badge walks (included total: ${AchievementData.total}, badge walk achievements are cached for the rest of the hour)</span>`

  let List = document.getElementById('achievementCountList')
  Achievements.recent.forEach(achievement => {
    let Column = document.createElement('div')
    Column.classList = 'col-auto'
    Column.innerHTML = `
    <img src="${achievement.asset.thumbnail}" width="175" height="175" class="img-fluid img-rounded">
    <br>
    <h4 style="
      white-space: pre;
      width: 275px;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 35px;
      margin-top: 10px;
      margin-bottom: 0px;
    "><small style="vertical-align: top;">#${( achievement.serial-1 )}.</small> <a class="link-reset" href="https://polytoria.com/store/${achievement.asset.id}" target="_blank">${achievement.asset.name}</a></h3>
    `
    List.appendChild(Column)
  })
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