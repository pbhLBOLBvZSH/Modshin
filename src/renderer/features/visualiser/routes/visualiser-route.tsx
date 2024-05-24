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
import { VisualiserType, VisualiserColorMode, VisualiserFreqScale, VisualiserMode } from '/@/renderer/types';
import { useModshinSettings } from '/@/renderer/store/settings.store';

function getStyles(type: VisualiserType) {
    switch (type) {
        case VisualiserType.BAR_GRAPH_ORANGERED:
        case VisualiserType.BAR_GRAPH_PRISM:
        case VisualiserType.BAR_GRAPH_RAINBOW:
        case VisualiserType.BAR_GRAPH_STEELBLUE:
        case VisualiserType.BAR_GRAPH:
            return styles.stylizedContainer;
    }
}

function audioMotionTypes(type: VisualiserType) {
    switch (type) {
        case VisualiserType.BAR_GRAPH: return 'classic';
        case VisualiserType.BAR_GRAPH_ORANGERED: return 'orangered';
        case VisualiserType.BAR_GRAPH_RAINBOW: return 'rainbow';
        case VisualiserType.BAR_GRAPH_STEELBLUE: return 'steelblue';

        default: case VisualiserType.BAR_GRAPH_PRISM: return 'prism';
    }
}

function colorMode(type: VisualiserColorMode) {
    switch (type) {
        case VisualiserColorMode.BAR_INDEX: return 'bar-index';
        case VisualiserColorMode.BAR_LEVEL: return 'bar-level';

        default: case VisualiserColorMode.GRADIENT: return 'gradient';
    }
}

function freqScale(type: VisualiserFreqScale) {
    switch (type) {
        case VisualiserFreqScale.BARK: return 'bark';
        case VisualiserFreqScale.LOG: return 'log';
        case VisualiserFreqScale.MEL: return 'mel';

        default: case VisualiserFreqScale.LINEAR: return 'linear';
    }
}

function visMode(type: VisualiserMode) {
    switch (type) {
        case VisualiserMode.ZERO: return 0;
        case VisualiserMode.ONE: return 1;
        case VisualiserMode.TWO: return 2;
        case VisualiserMode.FOUR: return 4;
        case VisualiserMode.FIVE: return 5;
        case VisualiserMode.SIX: return 6;
        case VisualiserMode.SEVEN: return 7;
        case VisualiserMode.EIGHT: return 8;
        case VisualiserMode.TEN: return 10;

        default:  case VisualiserMode.THREE: return 3;
    }
}

const VisualiserRoute = () => {

    const { webAudio } = useWebAudio();
    const canvasRef = useRef<HTMLDivElement>(null);
    const accent = useSettingsStore((store) => store.general.accent);
    const [motionx, setMotion] = useState<AudioMotionAnalyzer>();

    const settings = useModshinSettings();

    const [length, setLength] = useState(500);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (webAudio != null && webAudio.gain && webAudio.context && canvasRef.current && !motionx) {
                console.log(settings.visualiser);
                switch (settings.visualiser) {
                    case VisualiserType.BAR_GRAPH:
                    case VisualiserType.BAR_GRAPH_ORANGERED:
                    case VisualiserType.BAR_GRAPH_PRISM:
                    case VisualiserType.BAR_GRAPH_RAINBOW:
                    case VisualiserType.BAR_GRAPH_STEELBLUE:
                        const audioMotion = new AudioMotionAnalyzer(canvasRef.current, {
                            ansiBands: true,
                            audioCtx: webAudio.context,
                            connectSpeakers: false,
                            gradient: audioMotionTypes(settings.visualiser),
                            colorMode: colorMode(settings.VisualiserColorMode),
                            frequencyScale: freqScale(settings.visualiserFreqScale),
                            mode: visMode(settings.visualiserMode),
                            showPeaks: false,
                            smoothing: 0.8,
                            barSpace: 0.1,
                        });
                        setMotion(audioMotion);
                        audioMotion.connectInput(webAudio.gain);
                        break;
                }

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
            className={getStyles(settings.visualiser)}
            // exit="exit"
            // initial="initial"
            // transition={{ duration: 0.3, ease: 'easeIn' }}
            // variants={variants}
        >
        </motion.main>
    );
};

export default VisualiserRoute;
