var originalText = document.getElementById("original-text").textContent;
var words = originalText.split(" ");
var index = 0;
var speed = 1.0;
var isPaused = false;
var isPlaying = false;
var playButton = document.getElementById("play-button");
var highlightedIndexes = []; // Indexes of words already highlighted

function readNextWord() {
    if (isPaused) {
        return; // If paused, do not proceed to the next word
    }

    if (index < words.length) {
        var word = words[index];
        var utterance = new SpeechSynthesisUtterance(word);
        
        // Select a French male voice (if available)
        var voices = speechSynthesis.getVoices();
        var frenchMaleVoice = voices.find(voice => voice.lang === 'fr-FR' && voice.name.includes('Male'));
        
        if (frenchMaleVoice) {
            utterance.voice = frenchMaleVoice;
        } else {
            // Use default voice if no French male voice is available
            utterance.voice = voices.find(voice => voice.default);
        }
        
        utterance.rate = 1.5 ;
        utterance.pause = 0;
        
        var textElement = document.getElementById("original-text");
        var originalContent = textElement.innerHTML;
        
        if (!highlightedIndexes.includes(index)) {
            words[index] = '<span class="highlight">' + word + '</span>';
            textElement.innerHTML = words.join(" ");
            highlightedIndexes.push(index);
        }
        
        utterance.onend = function() {
            index++;
            readNextWord();
        };
        speechSynthesis.speak(utterance);
    } else {
        isPlaying = false;
        playButton.textContent = "Lire";
    }
}

playButton.addEventListener("click", function() {
    if (!isPlaying) {
        if (index >= words.length) {
            index = 0;
        }
        isPlaying = true;
        playButton.textContent = "Pause";
        readNextWord();
    } else {
        isPaused = !isPaused;
        if (isPaused) {
            playButton.textContent = "Continuer";
        } else {
            playButton.textContent = "Pause";
            readNextWord(); // Resume playback after pause
        }
    }
});




