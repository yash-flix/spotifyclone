
let currentSong= new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    let currFolder = folder;
    try {
        // Fetch the response
        let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
        
        // Ensure the response is valid
        if (!a.ok) {
            throw new Error(`HTTP error! Status: ${a.status}`);
        }
        
        // Await the text content
        let response = await a.text();
        
        // Parse the response into a DOM element
        let div = document.createElement("div");
        div.innerHTML = response;
        
        // Find all <a> tags
        let as = div.getElementsByTagName("a");
        songs = [];

        // Loop through <a> tags and extract .mp3 links
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }
        
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        songUL.innerHTML="";
    for(const song of songs)
    {
        songUL.innerHTML= songUL.innerHTML +`<li> <img class="invert" <img src="music.svg" > 
        <div class="info ">
            <div>${song.replaceAll("%20", " ")}</div>
            <div></div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="playbtn.svg">
        </div>
    
    </li>`
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>
    {
        e.addEventListener("click" , element=>
        {
           // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        }
        )

    } )      
    }
       
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic=(track)=>{
    //et audio = new Audio("/songs/" + track);
    currentSong.src=`/${ currFolder}/` + track;
    currentSong.play();
    
    play.src="pause.svg";
    document.querySelector(".songinfo").innerHTML=track ;
    document.querySelector(".songtime").innerHTML="00:00/ 00:00";
    
}

async function main() {
   
    await getSongs("songs/ncs");
    console.log(songs);
    
    play.addEventListener("click" , ()=>
        {
         if (currentSong.paused)
         {
             currentSong.play();
             play.src="pause.svg";
         }
         else
         {
             currentSong.pause();
             play.src="playsong.svg";
         }
        })
        currentSong.addEventListener("timeupdate" , ()=>
        {
            //console.log(currentSong.currentTime , currentSong.duration);
            document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
            document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration)*100 + "%";
        })
        document.querySelector(".seekbar").addEventListener("click", (e)=>
        {
            let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left= percent + "%";
            currentSong.currentTime = ((currentSong.duration)*percent)/100;
        })
        document.querySelector(".left").addEventListener("click", ()=>
        {
            document.querySelector(".left").style.left = "0";
        })
        document.querySelector(".close").addEventListener("click", ()=>
            {
                document.querySelector(".close").style.left = "-120";
            })

        previous.addEventListener("click", ()=>
        {
            currentSong.pause()
            console.log("Previous clicked");
            let index = songs   .indexOf(currentSong.src.split("/").slice(-1)[0]);
               if((index-1) >= 0){
               playMusic(songs [index-1]);}
        })
        next.addEventListener("click", () => {
            currentSong.pause()
            console.log("Next clicked")
    
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
            }
        })
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>
        {
            currentSong.volume = parseInt(e.target.value)/100;
        })
        Array.from(document.getElementsByClassName("card")).forEach(e=>
        {
            e.addEventListener("click" , async item =>
            {
                songs = await getSongs(`songs/${item.currentTarget.folder}`)
            }
            )
        }
        )
        
}

main();
