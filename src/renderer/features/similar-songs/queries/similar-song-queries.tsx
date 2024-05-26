import { useQuery } from '@tanstack/react-query';
import { SimilarSongsQuery, QueueSong } from '/@/renderer/api/types';
import { QueryHookArgs } from '/@/renderer/lib/react-query';
import { getServerById, modshinSettings } from '/@/renderer/store';
import { queryKeys } from '/@/renderer/api/query-keys';
import { api } from '/@/renderer/api';

export const useSimilarSongs = (args: QueryHookArgs<SimilarSongsQuery>) => {
    const { options, query, serverId } = args || {};
    const server = getServerById(serverId);

    return useQuery({
        enabled: !!server,
        queryFn: ({ signal }) => {
            if (!server) throw new Error('Server not found');

            return api.controller.getSimilarSongs({
                apiClientProps: { server, signal },
                query: {
                    albumArtistIds: query.albumArtistIds,
                    count: query.count ?? 50,
                    songId: query.songId,
                },
            });
        },
        queryKey: queryKeys.songs.similar(server?.id || '', query),
        ...options,
    });
};

export const getMostSimilarSong = async (song: QueueSong, ignore: Array<QueueSong> = [], amount: number) => {
    const settings = modshinSettings();
    if (settings.autoPlay === false) return null;

    const serverId = song.serverId;
    const server = getServerById(serverId);

    if (!server) {
        console.log("No server, wtf?")
        return null;
    }

    let attempts = 0;
    let newSongs: QueueSong[] = [];
    const excludeArtistIds: string[] = [];

    do {
        const query = {
            excludeArtistIds: excludeArtistIds.join(','),
            songId: song.id,
        };

        console.log('query', query);

        const response = await api.controller.getSimilarSongs({
            apiClientProps: { server },
            query,
        });

        console.log('response', response);

        if (!response || response.length === 0) return null;

        console.log('response', response);

        // Try to find songs that are not in the ignore list
        const songs = response.filter((songItem) => {
            return (
                !ignore.some((ignoreItem) => ignoreItem.id === songItem.id) &&
                songItem.id !== song.id
            );
        });

        // If no new songs are found, add the artist of the current song to the exclude list
        if (songs.length === 0) {
            const artist = song.artists[0];
            if (excludeArtistIds.indexOf(artist.id) === -1) excludeArtistIds.push(artist.id);
        } else {
            newSongs = [...newSongs, ...songs.slice(0, amount - newSongs.length)];
        }

        attempts += 1;
    } while (newSongs.length < amount && attempts < 25); // Limit the number of attempts to prevent infinite loops

    // If new songs are found, return them
    if (newSongs.length > 0) return newSongs.map(song => (song.isAuto = true, song));

    // If no new songs are found, return null
    return null;
};
