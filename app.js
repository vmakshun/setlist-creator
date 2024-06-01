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
    { name: "Kabeta Insiekta", duration: "3:13" },
    { name: "Dozdz Idzec", duration: "4:55" },
    { name: "Zurauli", duration: "3:57" },
    { name: "Jaščarka", duration: "6:35" },
    { name: "Reki pad Ildom", duration: "8:10" },
    { name: "Try chviliny", duration: "4:18" },
    { name: "Oi, Rana na Ivana", duration: "8:00" },
    { name: "Nažy", duration: "1:48" },
    { name: "Nažy", duration: "3:51" },
    { name: "Chutka niedalioka", duration: "3:41" },
    { name: "Brudnaja dziaŭčyna", duration: "4:00" },
    { name: "Vočy", duration: "3:50" },
    { name: "Try yanhaly", duration: "5:30" },
    { name: "Velitaj (Perapilko)", duration: "3:38" },
    { name: "Drobnieńki doždžyk", duration: "3:25" },
    { name: "Svatočki", duration: "4:35" },
    { name: "Tolki snieh (feat. Arakelian)", duration: "5:08" },
    { name: "Kroplia", duration: "8:10" },
    { name: "Chvali Času", duration: "4:06" },
    { name: "Navalnica", duration: "5:31" },
    { name: "Pakul use spiac", duration: "5:22" },
    { name: "Pra chornyja Vocy", duration: "4:08" },
    { name: "Музыка", duration: "3:31" },
    { name: "Ужо вясна", duration: "3:44" },
    { name: "Дзеўкі", duration: "3:40" },
    { name: "Дзяўчына плача", duration: "3:48" },
    { name: "У ляску", duration: "3:41" },
    { name: "Там за тынам", duration: "3:53" },
    { name: "Не задавай", duration: "4:26" },
    { name: "Татачка", duration: "4:30" },
    { name: "Цёмна ночка", duration: "4:06" },
    { name: "Туман", duration: "5:14" },
    { name: "Надоело", duration: "4:41" },
    { name: "Прыйшоў гэты дзень", duration: "3:52" }
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
        const messageText = `Selected Songs:\n${selectedSongsData.map(song => `${song.name} - ${song.duration}`).join('\n')}`;

        // Send the message text to the bot
        fetch(`https://api.telegram.org/bot${tg.initDataUnsafe.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: tg.initDataUnsafe.user.id,
                text: messageText
            })
        }).then(response => {
            if (response.ok) {
                tg.close();
            } else {
                console.error('Failed to send message to bot');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});
