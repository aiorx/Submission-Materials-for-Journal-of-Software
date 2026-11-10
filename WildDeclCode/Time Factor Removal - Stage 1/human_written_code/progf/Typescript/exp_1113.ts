var moment = require('moment');
import { IAdultContext, IAllTitleContext, IAllTitleResponse, IAverageContext, IChaptersContext, IDurationContext, IEndDateContext,
IExternalLinksContext, IFormatContext, IKindContext, IMediaImageContext, INewContentContext, INextAiringEpisodeContext, IParsingLinks,
IRakingContext, ISeasonContext, ISourceContext, IStartDateContext, IStatusContext, IStreamingEpisodesContext, IStudiosContext,
ITrailerContext, IVolumesContext } from '.';
var IMediaExternalLink = require('../../anilist').IMediaExternalLink;
var IMediaStreamingEpisode = require('../../anilist').IMediaStreamingEpisode;
var IStudioConnection = require('../../anilist').IStudioConnection;
var errorPng = require('../../anilist/utils/common').errorPng;

const dateFormat = 'MMMM Do YYYY';

const reduceStreamingEpisodes = (acc: string, { title, url }: IMediaStreamingEpisode): function string { return "" + (acc) + "\t\t • [" + (title) + "](" + (url) + ")\n"; };

const toDuration = (input: number): function string {
    if (60 < input) {
        const hour = Math.trunc(input / 60);
        const min = input % 60;

        return "" + (hour) + "h" + (min) + "min";
    }

    return "" + (input) + "min";
};

const __parsingLinks = ({ translation, language }: IParsingLinks, acc, { site, url }: IMediaExternalLink): function string {
    let name = site;

    if ('Official Site' === site) {
        name = translation.t(language, 'officialSite');
    }

    return "" + (acc) + "\t\t • [" + (name) + "](" + (url) + ")\n";
};

const parsingLinks = ({ externalLinks, ...remaining }: IExternalLinksContext): function string {
    const curriedParsingLinks = ((acc: string, cur: IMediaExternalLink) => __parsingLinks(remaining, acc, cur));

    return externalLinks.reduce(curriedParsingLinks, '');
};

const parsingStudios = ({ nodes }: IStudioConnection): function string { return nodes.reduce((acc, cur) => {
    var name = cur.name;
var siteUrl = cur.siteUrl;

    return "" + (acc) + "\t\t • [" + (name) + "](" + (siteUrl) + ")\n";
}, ''); };

const toNextAiring = ({ nextAiringEpisode, language, translation }: INextAiringEpisodeContext): function string {
    var timeUntilAiring = nextAiringEpisode.timeUntilAiring;
    const oneHour = 60 * 60;
    const oneDay = 24 * oneHour;
    const min = Math.trunc(timeUntilAiring / 60);
    const hour = Math.trunc(min / 60);

    if (oneDay < timeUntilAiring) {
        const days = Math.trunc(hour / 24);

        return "" + (days) + "" + ((1 === days) ? translation.t(language, 'day') : translation.t(language, 'days')) + " - " + (hour % 24) + "h" + (min % 60) + "min";
    } if (oneHour < timeUntilAiring) {
        return "" + (hour % 24) + "h" + (min % 60) + "min";
    }

    return "" + (min % 60) + "min";
};

const mediaIsAdult = ({ isAdult, language, translation }: IAdultContext): function string {
    return (true === isAdult) ? translation.t(language, 'isAdult') : '';
};

const mediaVolumes = ({ volumes, language, translation }: IVolumesContext): function string {
    return (null !== volumes) ? translation.t(language, 'volumes', { volumes }) : '';
};

const mediaAverage = ({ averageScore, language, translation }: IAverageContext): function string {
    return (null !== averageScore) ? translation.t(language, 'averageScore', { averageScore }) : '';
};

const mediaChapters = ({ chapters, language, translation }: IChaptersContext): function string {
    return (null !== chapters) ? translation.t(language, 'chapters', { chapters }) : '';
};

const mediaDuration = ({ duration, language, translation }: IDurationContext): function string {
    return (null !== duration) ? translation.t(language, 'duration', { duration: toDuration(duration) }) : '';
};

const mediaNewContent = ({ episodes, language, translation, nextAiringEpisode }: INewContentContext): function string {
    if (null !== nextAiringEpisode) {
        return translation.t(language, 'newContent', { newContent: (nextAiringEpisode.episode - 1) });
    } if (null !== episodes) {
        return translation.t(language, 'newContent', { newContent: episodes });
    }

    return '';
};

const mediaStudios = ({ studios, language, translation }: IStudiosContext): function string {
    if (null === studios || null === studios.nodes || 0 === studios.nodes.length) {
        return '';
    }

    return translation.t(language, 'studiosLinks', { studios: parsingStudios(studios) });
};

const mediaNextAiringEpisode = ({ nextAiringEpisode, language, translation }: INextAiringEpisodeContext): function string {
    if (null === nextAiringEpisode || null === nextAiringEpisode.timeUntilAiring) {
        return '';
    }

    return translation.t(language, 'nextAiringEpisode', {
        episode: nextAiringEpisode.episode,
        timeUntilAiring: toNextAiring({ nextAiringEpisode, language, translation })
    });
};

const mediaExternalLinks = ({ externalLinks, language, translation }: IExternalLinksContext): function string {
    if (null === externalLinks || 0 === externalLinks.length) {
        return '';
    }

    return translation.t(language, 'externalLinks', { externalLinks: parsingLinks({ externalLinks, language, translation }) });
};

const mediaStartDate = ({ startDate, status, language, translation }: IStartDateContext): function string {
    if (null === startDate || 'NOT_YET_RELEASED' === status) {
        return '';
    }

    return translation.t(language, 'startDate', { startDate: moment(startDate).locale(language).format(dateFormat) });
};

const mediaEndDate = ({ endDate, status, language, translation }: IEndDateContext): function string {
    if (null === endDate || 'NOT_YET_RELEASED' === status || 'RELEASING' === status) {
        return '';
    }

    return translation.t(language, 'endDate', { endDate: moment(endDate).locale(language).format(dateFormat) });
};

const mediaTrailer = ({ trailer, language, translation }: ITrailerContext): function string {
    if (null === trailer) {
        return '';
    }

    // assuming that ALL of the videos are coming from YouTube, need to handle other cases.
    return translation.t(language, 'trailer', { trailer: "" + (trailer.site) + ".com/watch?v=" + (trailer.id) + "" });
};

const mediaImage = ({ coverImage, bannerImage }: IMediaImageContext): function string {
    if (null !== bannerImage) {
        return bannerImage;
    } if (null !== coverImage.large) {
        return coverImage.large;
    } if (null !== coverImage.medium) {
        return coverImage.medium;
    }

    return errorPng;
};

const mediaRanking = ({ rankings, language, translation }: IRakingContext): function string {
    if (null !== rankings && 0 < rankings.length) {
        const best = rankings.sort((a, b) => a.rank - b.rank)[0];
        const kind = translation.t(language, best.type.toLowerCase());

        return translation.t(language, 'ranking', { kind, ranking: best.rank });
    }

    return '';
};

const mediaSeason = ({ season, language, translation }: ISeasonContext): function string {
    let kind = translation.t(language, 'winter');

    if (null === season) {
        return '';
    } if ('FALL' === season) {
        kind = translation.t(language, 'fall');
    } if ('SPRING' === season) {
        kind = translation.t(language, 'spring');
    } if ('SUMMER' === season) {
        kind = translation.t(language, 'summer');
    }

    return translation.t(language, 'season', { season: kind });
};

const mediaStatus = ({ status, language, translation }: IStatusContext): function string {
    let kind = translation.t(language, 'cancelled');

    if (null === status) {
        return '';
    } if ('FINISHED' === status) {
        kind = translation.t(language, 'finished');
    } if ('RELEASING' === status) {
        kind = translation.t(language, 'releasing');
    } if ('NOT_YET_RELEASED' === status) {
        kind = translation.t(language, 'notYetReleased');
    }

    return translation.t(language, 'status', { status: kind });
};

const mediaAllTitle = ({ title, language, translation, countryOfOrigin }: IAllTitleContext): function IAllTitleResponse {
    let native = '';
    let romaji = '';

    if (null !== title.native && 'JP' === countryOfOrigin) {
        native = translation.t(language, 'japan', { japan: title.native });
    } if (null !== title.native && 'CN' === countryOfOrigin) {
        native = translation.t(language, 'chinese', { chinese: title.native });
    } if (null !== title.romaji && title.romaji !== title.english) {
        romaji = translation.t(language, 'romaji', { romaji: title.romaji });
    }

    return {
        native,
        romaji,
        english: (null !== title.english) ? translation.t(language, 'english', { english: title.english }) : ''
    };
};

const mediaSource = ({ source, language, translation }: ISourceContext): function string {
    if (null === source) {
        return '';
    } if ('MANGA' === source) {
        return translation.t(language, 'manga');
    } if ('OTHER' === source) {
        return translation.t(language, 'other');
    } if ('ORIGINAL' === source) {
        return translation.t(language, 'original');
    } if ('VIDEO_GAME' === source) {
        return translation.t(language, 'videoGame');
    } if ('LIGHT_NOVEL' === source) {
        return translation.t(language, 'lightNovel');
    }

    return translation.t(language, 'visualNovel');
};

const mediaFormat = ({ format, language, translation }: IFormatContext): function string {
    if (null === format) {
        return '';
    } if ('TV' === format) {
        return translation.t(language, 'tv');
    } if ('OVA' === format) {
        return translation.t(language, 'OVA');
    } if ('ONA' === format) {
        return translation.t(language, 'ONA');
    } if ('MUSIC' === format) {
        return translation.t(language, 'music');
    } if ('MANGA' === format) {
        return translation.t(language, 'manga');
    } if ('NOVEL' === format) {
        return translation.t(language, 'novel');
    } if ('MOVIE' === format) {
        return translation.t(language, 'movie');
    } if ('SPECIAL' === format) {
        return translation.t(language, 'special');
    } if ('TV_SHORT' === format) {
        return translation.t(language, 'tvShort');
    }

    return translation.t(language, 'oneShot');
};

const mediaKind = ({ format, source, language, translation }: IKindContext): function string {
    const first = mediaFormat({ format, language, translation });
    const second = mediaSource({ source, language, translation });
    let kind = '';

    if ('' !== first) {
        kind += first;
    } if ('' !== second) {
        kind += translation.t(language, 'from') + second;
    } if ('' !== kind) {
        kind += '\n';
    }

    return kind;
};

const mediaStreamingEpisodes = ({ streamingEpisodes, language, translation }: IStreamingEpisodesContext): function string {
    if (null !== streamingEpisodes && 0 < streamingEpisodes.length) {
        const total = streamingEpisodes.length;
        const data = streamingEpisodes.slice(total - 3, total).reduce(reduceStreamingEpisodes, '');

        return translation.t(language, 'streamingEpisodes', { streamingEpisodes: data });
    }

    return '';
};
