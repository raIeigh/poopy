async function main() {
    function sortArrayRandomly(array) {
        function random_sort() {
            return Math.random() - 0.5
        }

        return array.sort(random_sort)
    }

    function mobileCheck() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    
    var fileButton = document.createElement('button')
    fileButton.innerHTML = `poopy is loading, please wait`
    fileButton.className = 'top'
    document.body.appendChild(fileButton)

    var psFiles
    var randomPs

    var ps = await $.getJSON('/api/globalData')
    psFiles = ps['bot-data']['psfiles']
    randomPs = sortArrayRandomly(psFiles)

    var count = 0
    var repeat = false
    var mobile = mobileCheck()
    var lastvideo
    var options = document.getElementById('options')
    fileButton.innerHTML = `click <b>here</b> for a file!!!!${mobile ? '' : ' (or press f)'}`
    var unmuteButton = document.createElement('button')
    unmuteButton.title = 'Unmutes all videos'
    var unmuteImage = document.createElement('img')
    unmuteImage.src = '/assets/unmute.png'
    unmuteButton.appendChild(unmuteImage)
    options.appendChild(unmuteButton)
    var muteButton = document.createElement('button')
    muteButton.title = 'Mutes all videos'
    var muteImage = document.createElement('img')
    muteImage.src = '/assets/mute.png'
    muteButton.appendChild(muteImage)
    options.appendChild(muteButton)
    var playButton = document.createElement('button')
    playButton.title = 'Replays all videos'
    var playImage = document.createElement('img')
    playImage.src = '/assets/play.png'
    playButton.appendChild(playImage)
    options.appendChild(playButton)
    var stopButton = document.createElement('button')
    stopButton.title = 'Stops all videos'
    var stopImage = document.createElement('img')
    stopImage.src = '/assets/stop.png'
    stopButton.appendChild(stopImage)
    options.appendChild(stopButton)
    var repeatButton = document.createElement('button')
    repeatButton.title = 'Stays at the last file'
    var repeatImage = document.createElement('img')
    repeatImage.src = '/assets/repeat.png'
    repeatButton.appendChild(repeatImage)
    options.appendChild(repeatButton)

    function clicked() {
        if (!randomPs) return
        window.scrollTo(0, document.body.scrollHeight)
        if (count < randomPs.length) {
            var url = randomPs[count]
            if (lastvideo) {
                lastvideo.muted = true
                lastvideo = undefined
            }
            if (url.endsWith('.mp4') || url.endsWith('.mov')) {
                var video = document.createElement('video')
                video.id = 'file'
                video.style.transition = '0.1s'
                video.style.width = '0px'
                video.controls = true
                video.autoplay = true
                video.loop = true
                video.src = url
                document.body.appendChild(video)
                lastvideo = video
                video.play()
                setTimeout(() => {
                    video.style.width = '300px'
                    setTimeout(() => {
                        window.scrollTo(0, document.body.scrollHeight)
                    }, 100)
                }, 0)
            } else {
                var img = document.createElement('img')
                img.id = 'file'
                img.style.transition = '0.1s'
                img.style.width = '0px'
                img.src = url
                document.body.appendChild(img)
                setTimeout(() => {
                    img.style.width = '300px'
                    setTimeout(() => {
                        window.scrollTo(0, document.body.scrollHeight)
                    }, 100)
                }, 0)
            }
            if (!repeat) {
                count++
            }
            fileButton.innerHTML = 'keep clicking for more!!!!'
            window.scrollTo(0, document.body.scrollHeight)
            if (count >= randomPs.length) {
                fileButton.innerHTML = 'oops, seems like you\'ve reached the end of it'
            }
        } else {
            fileButton.innerHTML = 'oops, seems like you\'ve reached the end of it'
        }
    }

    fileButton.addEventListener('click', clicked)

    if (!mobile) {
        document.addEventListener('keypress', (event) => {
            if (event.key === 'f') clicked()
        })
    }

    muteButton.addEventListener('click', () => {
        var videos = document.getElementsByTagName('video')

        for (var i in videos) {
            var video = videos[i]

            video.muted = true
        }
    })

    unmuteButton.addEventListener('click', () => {
        var videos = document.getElementsByTagName('video')

        for (var i in videos) {
            var video = videos[i]

            video.muted = false
            video.volume = 1
        }
    })

    playButton.addEventListener('click', () => {
        var videos = document.getElementsByTagName('video')

        for (var i in videos) {
            var video = videos[i]

            video.play()
            video.currentTime = 0
        }
    })

    stopButton.addEventListener('click', () => {
        var videos = document.getElementsByTagName('video')

        for (var i in videos) {
            var video = videos[i]

            video.pause()
            video.currentTime = 0
        }
    })

    repeatButton.addEventListener('click', () => {
        repeat = !repeat
        count = repeat ? (((count - 1) < 0) ? 0 : count - 1) : (((count + 1) >= randomPs.length) ? randomPs.length : count + 1)
    })
}

main()