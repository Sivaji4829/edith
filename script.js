const synth = window.speechSynthesis;
        let songQueue = []; // To keep track of the songs to be played
        let currentAudio = null; // To keep track of the currently playing song

        function speak(text) {
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        }

        function startVoiceCommand() {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.onresult = function(event) {
                const command = event.results[0][0].transcript.toLowerCase();
                processVoiceCommand(command);
            };
            recognition.start();
            speak("Listening for your command...");
        }

        function processVoiceCommand(command) {
    if (
        command.includes('play song') ||
        command.includes('play music') ||
        command.includes('play songs') ||
        command.includes('start music') ||
        command.includes('play track')
    ) {
        playSong();
    } else if (
        command.includes('open file') ||
        command.includes('open document') ||
        command.includes('show file') ||
        command.includes('display file') ||
        command.includes('load file')
    ) {
        openFile();
    } else if (
        command.includes('send email') ||
        command.includes('email') ||
        command.includes('compose email') ||
        command.includes('write email') ||
        command.includes('send message')
    ) {
        sendEmail();
    } else if (
        command.includes('activate security assistant') ||
        command.includes('start security') ||
        command.includes('enable security') ||
        command.includes('security on') ||
        command.includes('activate monitoring')
    ) {
        activateSecurityAssistant();
    } else if (
        command.includes('wake up') ||
        command.includes('activate background') ||
        command.includes('start background') ||
        command.includes('show background') ||
        command.includes('enable background')
    ) {
        activateBackground();
    } else if (
        command.includes('ok take rest') ||
        command.includes('deactivate background') ||
        command.includes('stop background') ||
        command.includes('hide background') ||
        command.includes('disable background')
    ) {
        deactivateBackground();
    } else {
        speak("Sorry, I didn't understand that command.");
    }
}


        function sendEmail() {
            const recipient = prompt('Enter the recipient email address:');
            const subject = prompt('Enter the subject of the email:');
            const body = prompt('Enter the body of the email:');
            if (recipient && subject && body) {
                document.getElementById('output').innerHTML = `<p>Sending email to ${recipient}...</p>`;
                speak(`Sending email to ${recipient}`);
            } else {
                document.getElementById('output').innerHTML = `<p>Email details missing.</p>`;
                speak("Email details missing.");
            }
        }

        function openFile() {
            const file = prompt('Enter the file name to open:');
            if (file) {
                document.getElementById('output').innerHTML = `<p>Opening file: ${file}</p>`;
                speak(`Opening file: ${file}`);
            } else {
                document.getElementById('output').innerHTML = `<p>No file specified.</p>`;
                speak("No file specified.");
            }
        }

        function playSong() {
            document.getElementById('fileInput').click();
        }

        function handleFileSelect(event) {
            const files = event.target.files;
            if (files.length === 0) {
                document.getElementById('output').innerHTML = `<p>No files selected.</p>`;
                speak("No files selected.");
                return;
            }

            songQueue = Array.from(files); // Update the song queue with the selected files
            playNextSong(); // Start playing the first song
        }

        function playNextSong() {
            if (currentAudio) {
                currentAudio.pause();
            }
            
            if (songQueue.length === 0) {
                document.getElementById('output').innerHTML = `<p>All songs have been played.</p>`;
                speak("All songs have been played.");
                toggleMusicControls(false); // Hide music controls
                return;
            }

            const file = songQueue.shift(); // Get the first song in the queue
            const reader = new FileReader();
            
            reader.onload = function(e) {
                currentAudio = new Audio(e.target.result);
                currentAudio.onended = playNextSong; // Play the next song when the current one ends
                currentAudio.play().catch(error => {
                    console.error('Error playing song:', error);
                    speak("Error playing song.");
                });
                document.getElementById('output').innerHTML = `<p>Playing song: ${file.name}</p>`;
                speak(`Playing song: ${file.name}`);
                toggleMusicControls(true); // Show music controls
            };

            reader.readAsDataURL(file);
        }

        function playCurrentSong() {
            if (currentAudio) {
                currentAudio.play().catch(error => {
                    console.error('Error playing song:', error);
                    speak("Error playing song.");
                });
                document.getElementById('output').innerHTML = `<p>Resumed playing song</p>`;
                speak("Resumed playing song.");
            }
        }

        function pauseCurrentSong() {
            if (currentAudio) {
                currentAudio.pause();
                document.getElementById('output').innerHTML = `<p>Paused song</p>`;
                speak("Paused song.");
            }
        }

        function playPreviousSong() {
            if (playedSongs.length === 0) {
                document.getElementById('output').innerHTML = `<p>No previous song available.</p>`;
                speak("No previous song available.");
                return;
            }

            const previousSongSrc = playedSongs.pop(); // Get the last played song
            if (currentAudio) {
                currentAudio.pause(); // Pause current song if any
            }

            currentAudio = new Audio(previousSongSrc);
            currentAudio.onended = function() {
                playNextSong(); // Continue with the queue if any songs are left
            };
            currentAudio.play().catch(error => {
                console.error('Error playing song:', error);
                speak("Error playing song.");
            });

            document.getElementById('output').innerHTML = `<p>Playing previous song</p>`;
            speak("Playing previous song.");
            toggleMusicControls(true); // Show music controls
        }

        function toggleMusicControls(show) {
            document.getElementById('musicControls').style.display = show ? 'block' : 'none';
        }

        function activateSecurityAssistant() {
            alert('Security Assistant Activated! Monitoring your surroundings...');
            document.getElementById('output').innerHTML = `<p>Security Assistant Activated! Monitoring...</p>`;
            speak("Security Assistant Activated! Monitoring...");
        }

        function activateBackground() {
            const videoElement = document.getElementById('backgroundVideo');
            if (videoElement) {
                videoElement.style.display = 'block'; // Show the video element
            } else {
                // If video element doesn't exist, you might want to create it dynamically
                const video = document.createElement('video');
                video.id = 'backgroundVideo';
                video.className = 'background-video';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                const source = document.createElement('source');
                source.src = 'templates/edith-bg.mp4'; // Replace with actual video URL
                source.type = 'video/mp4';
                video.appendChild(source);
                document.body.appendChild(video);
            }
            speak("Hello boss, your Edith is ready for work");
            document.getElementById('output').innerHTML = "<p>Edith protocol active...</p>";
        }

        function deactivateBackground() {
            const videoElement = document.getElementById('backgroundVideo');
            if (videoElement) {
                videoElement.style.display = 'none'; // Hide the video element
            }
            speak("Edith protocol sleep mode");
            document.getElementById('output').innerHTML = "<p>Edith protocol sleep mode...</p>";
        }
