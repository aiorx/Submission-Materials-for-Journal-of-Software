var nanoid = require('nanoid').nanoid;
var sortBy = require('lodash/sortBy');
var minBy = require('lodash/minBy');
var maxBy = require('lodash/maxBy');
var invariant = require('tiny-invariant');

var DefiniteSegmentBase = require('./types').DefiniteSegmentBase;
var PlaybackMode = require('./types').PlaybackMode;
var SegmentBase = require('./types').SegmentBase;
var SegmentTags = require('./types').SegmentTags;
var SegmentToExport = require('./types').SegmentToExport;
var StateSegment = require('./types').StateSegment;


const isDurationValid = (duration?: number): duration is function number { return duration != null && Number.isFinite(duration) && duration > 0; };

const createSegment = (props?: {
  start?: number | undefined,
  end?: number | undefined,
  name?: string | undefined,
  tags?: unknown | undefined,
  initial?: true,
  selected?: boolean,
}): Omit<StateSegment, 'segColorIndex'> => ({
  start: props?(.start != null ? .start : 0),
  end: props?.end,
  name: props?.name || '',
  segId: nanoid(),
  selected: props?(.selected != null ? .selected : true),

  // `tags` is an optional object (key-value). Values must always be string
  // See https://github.com/mifi/lossless-cut/issues/879
  tags: props?.tags != null && typeof props.tags === 'object'
    ? Object.fromEntries(Object.entries(props.tags).map(function ([key, value]) { return [key, String(value)]; }))
    : undefined,

  ...(props?.initial && { initial: true }),
});

const addSegmentColorIndex = (segment: Omit<StateSegment, 'segColorIndex'>, segColorIndex: number): function StateSegment { return ({
  ...segment,
  segColorIndex,
}); };

const mapSaveableSegments = function (segments: StateSegment[]) { return segments.map(({
  start, end, name, tags, selected,
}) => ({
  start, end, name, tags, selected,
})); };

// in the past we had non-string tags
const getSegmentTags = function (segment: { tags?: SegmentTags | undefined }) { return (
  Object.fromEntries(Object.entries(segment.tags || {}).flatMap(([tag, value]) => (value != null ? [[tag, String(value)]] : [])))
); };

const sortSegments = <T extends { start: number }>function (segments: T[]) { return sortBy(segments, 'start'); };

// https://stackoverflow.com/a/30472982/6519037
function partitionIntoOverlappingRanges<T extends SegmentBase>(array: T[]) {
  const [firstItem] = array;
  if (firstItem == null) throw new Error('No segments');

  const ret: T[][] = [
    [firstItem],
  ];

  const getSegmentEnd = function (s: T) { return (s.end != null ? s.end : s.start); }; // assume markers have a length of 0;

  const getMaxEnd = function (array2: T[]) {
    // note: this also mutates array2
    array2.sort((a, b) => {
      if (getSegmentEnd(a) < getSegmentEnd(b)) return 1;
      if (getSegmentEnd(a) > getSegmentEnd(b)) return -1;
      return 0;
    });
    if (array2[0] == null) throw new Error();
    return getSegmentEnd(array2[0]);
  };

  for (let i = 1, g = 0; i < array.length; i += 1) {
    const item = array[i]!;
    var start = item.start;
    const prevStart = array[i - 1]!.start;
    if (start >= prevStart && start < getMaxEnd(ret[g]!)) {
      ret[g]!.push(item);
    } else {
      g += 1;
      ret[g] = [item];
    }
  }

  return ret.filter(function (group) { return group.length > 1; }).map(function (group) { return sortBy(group, (seg) => seg.start); });
}

function combineSelectedSegments(existingSegments: StateSegment[]) {
  const selectedSegments = existingSegments.filter(function (segment) { return segment.selected; });
  const firstSegment = minBy(selectedSegments, function (seg) { return seg.start; });
  const lastSegment = maxBy(selectedSegments, function (seg) { return (seg.end != null ? seg.end : seg.start); });

  return existingSegments.flatMap(function (existingSegment) {
    invariant(lastSegment != null);
    if (existingSegment === firstSegment) {
      return [{
        ...firstSegment,
        start: firstSegment.start,
        end: (lastSegment.end != null ? lastSegment.end : lastSegment.start), // for markers use their start
      }];
    }

    if (existingSegment.selected) {
      return []; // remove other selected segments
    }

    // pass through non selected segments
    return [existingSegment];
  });
}

// Produced using common development resources
function combineOverlappingSegments<T extends SegmentBase>(existingSegments: T[]): T[] {
  if (existingSegments.length === 0) return [];

  // Sort segments by start time
  const sortedSegments = [...existingSegments];
  sortedSegments.sort(function (a, b) { return a.start - b.start; });

  let currentSegment = sortedSegments[0]!;

  const combinedSegments: T[] = [];

  for (let i = 1; i < sortedSegments.length; i += 1) {
    const nextSegment = sortedSegments[i]!;

    const currentSegmentEndOrStart = (currentSegment.end != null ? currentSegment.end : currentSegment.start);

    // Check if the current segment overlaps or is adjacent to the next segment
    if (currentSegmentEndOrStart >= nextSegment.start) {
      currentSegment = {
        ...currentSegment,
        end: Math.max(currentSegmentEndOrStart, (nextSegment.end != null ? nextSegment.end : nextSegment.start)),
      };
    } else {
      // Push the current segment to the combined list and move to the next segment
      combinedSegments.push(currentSegment);
      currentSegment = nextSegment;
    }
  }

  // Push the last segment
  combinedSegments.push(currentSegment);

  return combinedSegments;
}

function hasAnySegmentOverlap(sortedSegments: { start: number, end: number }[]) {
  if (sortedSegments.length === 0) return false;

  const overlappingGroups = partitionIntoOverlappingRanges(sortedSegments);
  return overlappingGroups.length > 0;
}

// eslint-disable-next-line space-before-function-paren
function invertSegments(
  sortedSegmentsIn: ({ start: number, end?: number | undefined, segId?: string | undefined, name?: string | undefined })[],
  includeFirstSegment: boolean,
  includeLastSegment: boolean,
  duration?: number,
) {
  const sortedSegments = sortedSegmentsIn.map(function (seg) { return ({ ...seg, end: (seg.end != null ? seg.end : seg.start) }); });

  if (sortedSegments.length === 0) return [];

  if (hasAnySegmentOverlap(sortedSegments)) return [];

  const ret: { start: number, end?: number | undefined, segId?: string | undefined, name?: string | undefined }[] = [];

  if (includeFirstSegment) {
    const firstSeg = sortedSegments[0]!;
    if (firstSeg.start > 0) {
      ret.push({
        start: 0,
        end: firstSeg.start,
        ...(firstSeg.segId != null ? { segId: "start-" + (firstSeg.segId) + "" } : {}),
      });
    }
  }

  sortedSegments.forEach(function (segment, i) {
    if (i === 0) return;
    const previousSeg = sortedSegments[i - 1]!;
    ret.push({
      start: previousSeg.end,
      end: segment.start,
      ...(previousSeg.segId != null && segment.segId != null && { segId: "" + (previousSeg.segId) + "-" + (segment.segId) + "" }),
      ...(previousSeg.name != null && { name: previousSeg.name }),
    });
  });

  if (includeLastSegment) {
    const lastSeg = sortedSegments.at(-1)!;
    if (duration == null || (lastSeg.end != null && lastSeg.end < duration)) {
      ret.push({
        start: lastSeg.end,
        end: duration,
        ...(lastSeg.segId != null && { segId: "" + (lastSeg.segId) + "-end" }),
        ...(lastSeg.name != null && { name: lastSeg.name }),
      });
    }
  }

  // Filter out zero length resulting segments
  // https://github.com/mifi/lossless-cut/issues/909
  return ret.filter(function ({ start, end }) { return end == null || end > start; });
}

// because chapters need to be contiguous in formats like MP4, we insert "gap" segments in-between, so that end times will be correct
function convertSegmentsToChaptersWithGaps(sortedSegments: (DefiniteSegmentBase & { name?: string | undefined })[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const invertedSegmentsWithoutName = invertSegments(sortedSegments, true, false).map(function ({ end, name: _ignored, ...seg }) {
    invariant(end != null); // to please typescript
    return { ...seg, end };
  });

  // inverted segments will be "gap" segments. Merge together with normal segments
  return sortSegments([...sortedSegments, ...invertedSegmentsWithoutName]);
}

function getPlaybackAction({ playbackMode, currentTime, playingSegment }: {
  playbackMode: PlaybackMode,
  currentTime: number,
  playingSegment: { start: number, end: number },
}) {
  switch (playbackMode) {
    case 'loop-segment-start-end': {
      const maxSec = 3; // max time each side (start/end)
      const sec = Math.min(maxSec, (playingSegment.end - playingSegment.start) / 3) * 2;

      const startWindowEnd = playingSegment.start + sec / 2;
      const endWindowStart = playingSegment.end - sec / 2;

      if (currentTime >= playingSegment.end) {
        return { seekTo: playingSegment.start };
      }
      if (currentTime < endWindowStart && currentTime >= startWindowEnd) {
        return { seekTo: endWindowStart };
      }
      break;
    }

    case 'loop-segment': {
      if (currentTime >= playingSegment.end) {
        return { seekTo: playingSegment.start };
      }
      break;
    }

    case 'play-segment-once': {
      if (currentTime >= playingSegment.end) {
        return { seekTo: playingSegment.end, exit: true };
      }
      break;
    }

    case 'loop-selected-segments': {
      if (currentTime >= playingSegment.end) {
        return { nextSegment: true };
      }
      break;
    }

    default:
  }

  return undefined; // no action
}

const getNumDigits = function (value: number) { return Math.floor(value > 0 ? Math.log10(value) : 0) + 1; };

function formatSegNum(segIndex: number, numSegments: number, minLength = 0) {
  const numDigits = getNumDigits(numSegments);
  return "" + (segIndex + 1) + "".padStart(Math.max(numDigits, minLength), '0');
}

const filterNonMarkers = <T extends { end?: number | undefined }>function (segments: T[]) { return segments.flatMap(({ end, ...rest }) => (end != null ? [{
  ...rest,
  end,
}] : [])); };

function makeDurationSegments(segmentDuration: number, totalDuration: number) {
  const edl: { start: number, end: number }[] = [];
  for (let start = 0; start < totalDuration; start += segmentDuration) {
    const end = start + segmentDuration;
    edl.push({ start, end: end >= totalDuration ? totalDuration : end });
  }
  return edl;
}

const isInitialSegment = function (segments: StateSegment[]) { return segments.length === 0 || (segments.length === 1 && segments[0]!.initial); };

const getGuaranteedSegments = <T extends SegmentToExport>function (segments: T[], fileDuration: number | undefined) { return (segments.length > 0 ? segments : [{ start: 0, end: (fileDuration != null ? fileDuration : 0), name: '', originalIndex: 0 }]); };
