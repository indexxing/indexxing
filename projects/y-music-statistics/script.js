/*
    IDEAS FOR STATISTICS:
    - preferred time of day
    - percentage decrease from last month
*/

const Page = document.getElementById('page')
const Data = document.getElementById('data')
const YearDropdown = document.getElementById('year-dropdown')

const URLParams = new URLSearchParams(new URL(window.location.href).search)
let Year = parseInt(URLParams.get('year')) || new Date().getFullYear()

const FileSelect = document.getElementById('file')
FileSelect.addEventListener('change', function(){
    const File = FileSelect.files[0]
    const Reader = new FileReader()
    Reader.addEventListener('loadend', function(){
        Load(JSON.parse(Reader.result))
    });
    Reader.readAsText(File)
});

let YearsAvailable = []
let LastSongPlayed = null

let MusicHistory = []
let ThisYear = []
let SongPlays = []
let MostPlayed = []
let ArtistPlays = []
let MostActiveArtist = []
let MostPlayedByArtist = []
let EarliestTime = { hour: 12, type: "AM" }
let LatestTime = { hour: 12, type: "AM" }
let DaysOfTheWeek = [
    {day: "Sunday", plays: 0},
    {day: "Monday", plays: 0},
    {day: "Tuesday", plays: 0},
    {day: "Wednesday", plays: 0},
    {day: "Thursday", plays: 0},
    {day: "Friday", plays: 0},
    {day: "Saturday", plays: 0}
]
let MostActiveWeekDay = null
let MonthsOfTheYear = [
    {month: "January", plays: 0},
    {month: "February", plays: 0},
    {month: "March", plays: 0},
    {month: "April", plays: 0},
    {month: "May", plays: 0},
    {month: "June", plays: 0},
    {month: "July", plays: 0},
    {month: "August", plays: 0},
    {month: "September", plays: 0},
    {month: "October", plays: 0},
    {month: "November", plays: 0},
    {month: "December", plays: 0}
]
let MostPlayedArtistByMonth = []

function Load(data) {
    if (URLParams.get('load') === 'false') { return }
    ResetVariables()
    MusicHistory = data.filter((x) => x.header === "YouTube Music")
    ThisYear = MusicHistory.filter((x) => new Date(x.time).getFullYear() === Year)

    MusicHistory.forEach(song => {
        const Year = new Date(song.time).getFullYear()
        if (!YearsAvailable.includes(Year)) {
            YearsAvailable.push(Year)
        }
    })
    YearDropdown.innerHTML = YearsAvailable.map((x) => `<option${ (x === Year) ? ' selected' : '' } value="${x}">${x}${ (x === new Date().getFullYear()) ? ' (not finished)' : '' }</option>`)
    
    ThisYear.forEach(song => {
        if (song.subtitles !== undefined) {
            const Creator = song.subtitles[0].name.replace(' - Topic', '') || null;
            const Title = song.title.replace('Watched ', '')
            const DatePlayed = new Date(song.time)

            const SongExists = SongPlays.findIndex(play => play.name === Title)
            if (SongExists !== -1) {
                SongPlays[SongExists].plays++
                DaysOfTheWeek[DatePlayed.getDay()].plays++
                MonthsOfTheYear[DatePlayed.getMonth()].plays++
                if (MonthsOfTheYear[DatePlayed.getMonth()].lastPlayed < DatePlayed.getTime()) {
                    MonthsOfTheYear[DatePlayed.getMonth()].lastPlayed = DatePlayed.getTime()
                }

                if (MostPlayedByArtist[Creator] === undefined) { MostPlayedByArtist[Creator] = {name: "", plays: 1}}
                if (SongPlays[SongExists].plays > (MostPlayedByArtist[Creator].plays || 1)) {
                    MostPlayedByArtist[Creator].name = Title
                    MostPlayedByArtist[Creator].plays = SongPlays[SongExists].plays
                }
            } else {
                SongPlays.push({name: Title, artist: Creator, plays: 1})
            }

            const ArtistExists = ArtistPlays.findIndex(artist => artist.name === Creator);
            if (ArtistExists !== -1) {
                ArtistPlays[ArtistExists].plays++;

                if (ArtistPlays[ArtistExists].lastPlayedTime < DatePlayed.getTime()) {
                    ArtistPlays[ArtistExists].lastPlayedTime = DatePlayed.getTime()
                    ArtistPlays[ArtistExists].lastPlayed = DatePlayed
                }

                //if (MostPlayedArtistByMonth[DatePlayed.getMonth()] === undefined) { MostPlayedArtistByMonth[Creator] = {month: MonthsOfTheYear[DatePlayed.getMonth()].month, artist: "", plays: 0} }
                //if (MostPlayedArtistByMonth[DatePlayed.getMonth].plays <)
            } else {
                ArtistPlays.push({ name: Creator, plays: 1, lastPlayed: new Date(song.time).getTime() });
            }

            /*
            if (new Date(song.time).getHours() < (EarliestTime || 12)) {
                EarliestTime = {
                    hour: new Date(song.time).getHours(),
                    type: (new Date(song.time).getHours() >= 12) ? "PM" : "AM"
                }
            }

            if (new Date(song.time).getHours() > (LatestTime || 0)) {
                LatestTime = {
                    hour: new Date(song.time).getHours(),
                    type: (new Date(song.time).getHours() >= 12) ? "PM" : "AM"
                }
            }
            */
        }
    })

    MostPlayed = [...SongPlays].sort((a, b) => b.plays - a.plays).splice(0, 3);
    MostActiveArtist = [...ArtistPlays].sort((a, b) => b.plays - a.plays).splice(0, 5);
    MostActiveWeekDay = DaysOfTheWeek.sort((a, b) => b.plays - a.plays)[0]

    Data.innerHTML = `
    <div class="col-md-5">
        <div class="card mb-3">
            <small class="card-header">TOP ARTIST</small>
            <div class="card-body">
                <h2 class="mb-0">${MostActiveArtist[0].name}</h2>
                <small>${MostActiveArtist[0].plays} STREAMS (~${Math.floor((MostActiveArtist[0].plays / ThisYear.length) * 100)}% of all songs streamed)</small>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="card mb-3">
                    <small class="card-header">2ND TOP ARTIST</small>
                    <div class="card-body">
                        <h4 class="text-muted mb-0">${MostActiveArtist[1].name}</h4>
                        <small>${MostActiveArtist[1].plays} STREAMS (~${Math.floor((MostActiveArtist[1].plays / ThisYear.length) * 100)}% of all songs streamed)</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card mb-3">
                    <small class="card-header">3RD TOP ARTIST</small>
                    <div class="card-body">
                        <h4 class="text-muted mb-0">${MostActiveArtist[2].name}</h4>
                        <small>${MostActiveArtist[2].plays} STREAMS (~${Math.floor((MostActiveArtist[2].plays / ThisYear.length) * 100)}% of all songs streamed)</small>
                    </div>
                </div>    
            </div>
        </div>

        <canvas id="most-played-artists"></canvas>
    </div>
    <div class="col-auto" style="--bs-gutter-x: 1px;">
        <hr style="color: inherit; height: 100%; border: 0.5px solid; margin: 0px;"></hr>
    </div>
    <div class="col">
        <div class="card mb-3">
            <small class="card-header">TOP SONG</small>
            <div class="card-body">
                <h2 class="mb-0">"${MostPlayed[0].name}"</h2>
                <small>BY <code>${MostPlayed[0].artist}</code> WITH <code>${MostPlayed[0].plays.toLocaleString()}</code> STREAMS OF THIS SONG</small>
            </div>
        </div>
        <div class="row text-center mb-3">
            <div class="col">
                <div class="card">
                    <small class="card-header">SONGS</small>
                    <div class="card-body">
                        <h4 class="mb-0">${ThisYear.length.toLocaleString()}</h4>
                        <small>STREAMED</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <small class="card-header">UNIQUE SONGS</small>
                    <div class="card-body">
                        <h4 class="mb-0">${SongPlays.length.toLocaleString()}</h4>
                        <small>STREAMED</small>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <small class="card-header">UNIQUE ARTISTS</small>
                    <div class="card-body">
                        <h4 class="mb-0">${ArtistPlays.length.toLocaleString()}</h4>
                        <small>STREAMED</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="row text-center">
            <div class="col">
                <div class="card">
                    <small class="card-header">MOST STREAMED WEEK DAY</small>
                    <div class="card-body">
                        <h4 class="mb-0">${MostActiveWeekDay.day}</h4>
                        <small>${MostActiveWeekDay.plays.toLocaleString()} STREAMS (~${Math.floor((MostActiveWeekDay.plays / ThisYear.length) * 100)}% of all songs streamed)</small>
                    </div>
                </div>
            </div>
            <!--
            <div class="col">
                <div class="card">
                    <small class="card-header">EARLIEST - LATEST</small>
                    <div class="card-body">
                        <h4 class="mb-0">${EarliestTime.hour} ${EarliestTime.type} - ${LatestTime.hour} ${LatestTime.type}</h4>
                        <small>PLAY TIME</small>
                    </div>
                </div>
            </div>
            -->
        </div>
        <canvas id="months-of-the-year"></canvas>
    </div>
    <hr>
    <small>
        Last Song Played: ~${FormatDateObject(new Date(ThisYear[0].time))}
        <br>
        (may be in-accurate due to no way of me seeing when the takeout data was downloaded)
        <br>
        <br>
        Chart.JS for the charts &lt;3
    </small>
    `
    FileSelect.parentElement.remove()
    Page.classList.remove('d-none')

    // the background and border colors for the actual charts are the same as on chart.js's documentation website
    new Chart(
        document.getElementById('most-played-artists'),
        {
            type: 'pie',
            data: {
                labels: [MostActiveArtist[0], MostActiveArtist[1], MostActiveArtist[2], MostActiveArtist[3], MostActiveArtist[4]].map(x => x.name),
                datasets: [
                    {
                        label: "Artist Plays",
                        data: [MostActiveArtist[0], MostActiveArtist[1], MostActiveArtist[2], MostActiveArtist[3], MostActiveArtist[4]].map(x => x.plays),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1
                    }
                ]
            }
        }
    )

    let PastMonths = MonthsOfTheYear.filter((x, index) => new Date().getMonth() >= index || new Date().getFullYear() > Year)
    new Chart(
        document.getElementById('months-of-the-year'),
        {
            type: 'bar',
            data: {
                labels: PastMonths.map((x, index) => x.month + ` ${ (index === new Date().getMonth() && Year === new Date().getFullYear()) ? '(ongoing)' : '' }`),
                datasets: [
                    {
                        label: "Song Plays",
                        data: PastMonths.map(x => x.plays),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {beginAtZero: true}
                }
            }
        }
    )
}

YearDropdown.addEventListener('change', function(){
    Year = parseInt(YearDropdown.options[YearDropdown.selectedIndex].value)

    const Reader = new FileReader()
    Reader.addEventListener('load', function(){
        Load(JSON.parse(Reader.result))
    });

    Reader.readAsText(FileSelect.files[0])
});

function ResetVariables() {
    LastSongPlayed = null

    MusicHistory = []
    ThisYear = []
    SongPlays = []
    MostPlayed = []
    ArtistPlays = []
    MostActiveArtist = []
    MostPlayedByArtist = []
    EarliestTime = { hour: 12, type: "AM" }
    LatestTime = { hour: 12, type: "AM" }
    DaysOfTheWeek = [
        {day: "Sunday", plays: 0},
        {day: "Monday", plays: 0},
        {day: "Tuesday", plays: 0},
        {day: "Wednesday", plays: 0},
        {day: "Thursday", plays: 0},
        {day: "Friday", plays: 0},
        {day: "Saturday", plays: 0}
    ]
    MostActiveWeekDay = null
    MonthsOfTheYear = [
        {month: "January", plays: 0},
        {month: "February", plays: 0},
        {month: "March", plays: 0},
        {month: "April", plays: 0},
        {month: "May", plays: 0},
        {month: "June", plays: 0},
        {month: "July", plays: 0},
        {month: "August", plays: 0},
        {month: "September", plays: 0},
        {month: "October", plays: 0},
        {month: "November", plays: 0},
        {month: "December", plays: 0}
    ]
    MostPlayedArtistByMonth = []
}

function FormatDateObject(dateObject) {
    return `${MonthsOfTheYear[dateObject.getMonth()].month} ${dateObject.getDate()}, ${dateObject.getFullYear()}`
}