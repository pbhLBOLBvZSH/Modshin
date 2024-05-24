import { useState, useEffect } from 'react';
import { AnimatedPage } from '/@/renderer/features/shared';

const JukeboxRoute = () => {
    const [audioContext, setAudioContext] = useState(null);
    const [source, setSource] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [beats, setBeats] = useState([]);
    const [songEnded, setSongEnded] = useState(false);
    const threshold = 1000;
    const simulThreshold = 0.75;

    const processBeats = (beats) => {
        const similarityMap = new Map();
    
        for (let i = 0; i < beats.length; i++) {
            for (let j = i + 1; j < beats.length; j++) {
                const similarity = calculateSimilarity(beats[i].data, beats[j].data);
                if (similarity > simulThreshold) {
                    if (!similarityMap.has(i)) {
                        similarityMap.set(i, []);
                    }
                    similarityMap.get(i).push({ beat: j, similarity });
                }
            }
        }
    
        // Now similarityMap is a map where the keys are beat indices and the values are arrays of
        // objects, each with a 'beat' property (the index of the similar beat) and a 'similarity'
        // property (the similarity score).

        console.log(similarityMap);
    };
    
    const calculateSimilarity = (data1, data2) => {
        // This is a placeholder. Replace this with your actual similarity calculation.
        let sum = 0;
        for (let i = 0; i < data1.length; i++) {
            sum += Math.abs(data1[i] - data2[i]);
        }
        return 1 / (1 + sum);
    };

    useEffect(() => {
        if (songEnded) {
            processBeats(beats);
        }
    }, [beats, songEnded]);

    useEffect(() => {
        if (!audioContext) {
            const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            const newAnalyser = newAudioContext.createAnalyser();
            setAudioContext(newAudioContext);
            setAnalyser(newAnalyser);
        }
    }, [audioContext]);


    const loadSong = async (file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            audioContext.decodeAudioData(e.target.result, function(buffer) {
                if (source) {
                    source.stop();
                }
                const newSource = audioContext.createBufferSource();
                newSource.buffer = buffer;
                newSource.connect(analyser);
                newSource.start(0);
                setSource(newSource);

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                let lastDataArray = new Uint8Array(bufferLength);
                const printFrequencyData = () => {
                    requestAnimationFrame(printFrequencyData);
                    analyser.getByteFrequencyData(dataArray);

                    // Basic onset detection: compare the current frequency data to the last one
                    const diff = dataArray.reduce((sum, value, index) => sum + Math.abs(value - lastDataArray[index]), 0);
                    if (diff > threshold) {
                        console.log('Beat detected');
                        setBeats(beats => [...beats, { timestamp: audioContext.currentTime, data: Uint8Array.from(dataArray) }]);
                    }

                    lastDataArray = dataArray.slice();
                };

                const intervalId = setInterval(printFrequencyData, 1); // Analyze 1000 times per second

                newSource.onended = () => {
                    clearInterval(intervalId);
                    setSongEnded(true);
                };
            });
        };
        reader.readAsArrayBuffer(file);
    };
    
    const handleFileChange = (e) => {
        loadSong(e.target.files[0]);
    };

    return (
        <AnimatedPage>
            <div>Jukebox Page</div>
            <input type="file" onChange={handleFileChange} />
        </AnimatedPage>
    );
};

export default JukeboxRoute;