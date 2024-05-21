import { useCallback, useEffect, useState, useRef } from 'react';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import styled from 'styled-components';
import { useSettingsStore } from '/@/renderer/store';
import { motion } from 'framer-motion';
import styles from './../../shared/components/animated-page.module.scss';
import { useWebAudio } from '/@/renderer/features/player/hooks/use-webaudio';
import { useMemo } from 'react';
import { AnimatedPage } from '/@/renderer/features/shared';
import { App } from '/@/renderer/features/jukebox/src/app';


const VisualiserRoute = () => {

    const { webAudio } = useWebAudio();
    const canvasRef = useRef<HTMLDivElement>(null);
    const accent = useSettingsStore((store) => store.general.accent);
    const [motionx, setMotion] = useState<AudioMotionAnalyzer>();
    
    const [length, setLength] = useState(500);
    
    
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (webAudio != null && webAudio.gain && webAudio.context && canvasRef.current && !motionx) {
                const audioMotion = new AudioMotionAnalyzer(canvasRef.current, {
                    ansiBands: true,
                    audioCtx: webAudio.context,
                    connectSpeakers: false,
                    gradient: 'prism',
                    mode: 4,
                    showPeaks: false,
                    smoothing: 0.8,
                });
                setMotion(audioMotion);
                audioMotion.connectInput(webAudio.gain);
            } else if (webAudio == null) {
                console.log('No webAudio');
            } else {
                console.log('No gain or context');
                console.log(webAudio.gain);
                console.log(webAudio.context);            }
        }, 1000); // Run the code every 1000 milliseconds (1 second)

        return () => {
            clearInterval(intervalId); // Clear the interval when the component is unmounted or when the dependencies change
        };
    }, [accent, canvasRef, motionx]);

    const resize = useCallback(() => {
        const body = document.querySelector('.full-screen-player-queue-container');
        const header = document.querySelector('.full-screen-player-queue-header');

        if (body && header) {
            const width = body.clientWidth - 30;
            const height = body.clientHeight - header.clientHeight - 30;

            setLength(Math.min(width, height));
        }
    }, []);

    useEffect(() => {
        resize();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [resize]);

    return (
        <motion.main
            animate={{}}
            ref={canvasRef}
            // animate="animate"
            className={styles.stylizedContainer}
            // exit="exit"
            // initial="initial"
            // transition={{ duration: 0.3, ease: 'easeIn' }}
            // variants={variants}
        >
        </motion.main>
    );
};

export default VisualiserRoute;
