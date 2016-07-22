const { ipcRenderer, shell } = require('electron')


var localstream;


document.addEventListener('click', (event) => {
    if (event.target.href) {
        // Open links in external browser
        shell.openExternal(event.target.href)
        event.preventDefault()
    } else if (event.target.classList.contains('js-refresh-action')) {
        updateWeather()
    } else if (event.target.classList.contains('js-quit-action')) {
        window.close()
    } else if (event.target.classList.contains('js-video-action')) {
        navigator.webkitGetUserMedia({ video: true , audio: false},
            function(stream) {

              localstream = stream;
                toggle_visibility('camera')
          
            },
            function() {
                alert('could not connect stream');
            }
        );
    }
})

function toggle_visibility(id) {
  console.log(id);
    var e = document.getElementById(id);
    console.log(e.style.display);
    if (e.style.display == 'block') {
        
        // stream.getVideoTracks().forEach(function(track) {
        //     track.stop();
        // });
        localstream.getTracks()[0].stop();
        console.log(localstream.getVideoTracks()[0].stop());
        wwindow.reload();
        e.style.display = 'none';
       
         
        
    } else {
        e.style.display = 'block';
         document.getElementById('camera').src = URL.createObjectURL(localstream);
     
    }
}


const updateWeather = () => {
    ipcRenderer.send('login-updated', "123123")
        // getGeoLocation().then(getWeather).then((weather) => {
        //   // Use local time
        //   weather.currently.time = Date.now()

    //   console.log('Got weather', weather)

    //   ipcRenderer.send('weather-updated', weather)
    //   updateView(weather)
    //   sendNotification(weather)
    //   previousWeather = weather
    // })
}
