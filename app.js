document.addEventListener("DOMContentLoaded", () => {
    const songs = [
        { name: "Liekavyja Travy", duration: "6:55" },
        { name: "Čaho ty, losia...", duration: "6:12" },
        { name: "Razam!", duration: "2:26" },
        { name: "Lucerna", duration: "4:49" },
        { name: "Stary", duration: "4:00" },
        { name: "Chadzila Halota", duration: "6:25" },
        { name: "Zrusany sviet", duration: "4:39" },
        { name: "Balotnyja Ahni", duration: "4:26" },
    ];

    const songList = document.querySelector('.song-list');
    const totalTimeDisplay = document.getElementById('total-time');
    const createButton = document.getElementById('create-button');
    let selectedSongs = [];

    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');
        songItem.dataset.index = index;
        songItem.innerHTML = `
            <span>${song.name}</span>
            <span>${song.duration}</span>
        `;
        songItem.addEventListener('click', () => {
            songItem.classList.toggle('selected');
            if (songItem.classList.contains('selected')) {
                selectedSongs.push(song);
            } else {
                selectedSongs = selectedSongs.filter(s => s !== song);
            }
            updateTotalTime();
        });
        songList.appendChild(songItem);
    });

    function updateTotalTime() {
        let totalMinutes = 0;
        let totalSeconds = 0;

        selectedSongs.forEach(song => {
            const [minutes, seconds] = song.duration.split(':').map(Number);
            totalMinutes += minutes;
            totalSeconds += seconds;
        });

        totalMinutes += Math.floor(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

        if (selectedSongs.length > 0) {
            createButton.style.display = 'block';
        } else {
            createButton.style.display = 'none';
        }
    }

    createButton.addEventListener('click', () => {
        const selectedSongsData = selectedSongs.map(song => ({
            name: song.name,
            duration: song.duration,
        }));
        tg.sendData(JSON.stringify(selectedSongsData));
        tg.close();
    });
});
