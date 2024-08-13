import { useQuery } from '@tanstack/react-query';
import { SimilarSongsQuery, QueueSong } from '/@/renderer/api/types';
import { QueryHookArgs } from '/@/renderer/lib/react-query';
import { getServerById, modshinSettings } from '/@/renderer/store';
import { queryKeys } from '/@/renderer/api/query-keys';
import { api } from '/@/renderer/api';

export const getPlayCountWorld = (song: QueueSong) => {
    const settings = modshinSettings();
    if (settings.lastfmApiKey.length === 0 || song.artistName == undefined || song.name == undefined) return {pretty: "?", raw:0};
    console.log('Fetching play count for:', song);

    const formatNumber = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    };

    // Check if the data is cached and not expired
    const cachedData = localStorage.getItem(`song_${song.id}`);
    if (cachedData) {
        const { playcount, expires } = JSON.parse(cachedData);
        if (Date.now() < expires) {
            console.log('Returning cached play count:', playcount);
            return {pretty: formatNumber(parseInt(playcount, 10)), raw: playcount};
        }
    }

    const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${settings.lastfmApiKey}&artist=${encodeURIComponent(song.artistName)}&track=${encodeURIComponent(song.name)}&format=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch song info');
            return {pretty: "?", raw:0};
        })
        .then(data => {
            if (data.track.playcount === undefined) return {pretty: "?", raw:0};
            console.log('Play count:', data.track.playcount);
            const playcount = parseInt(data.track.playcount, 10);
            // Cache the data with an expiration date (1 week from now)
            const expires = Date.now() + (7 * 24 * 60 * 60 * 1000); // 1 week in milliseconds
            localStorage.setItem(`song_${song.id}`, JSON.stringify({ playcount: playcount.toString(), expires }));
            return {pretty: formatNumber(playcount), raw: playcount};
        })
        .catch(error => {
            console.error('Error fetching play count:', error);
            return {pretty: "?", raw:0};
        });
}