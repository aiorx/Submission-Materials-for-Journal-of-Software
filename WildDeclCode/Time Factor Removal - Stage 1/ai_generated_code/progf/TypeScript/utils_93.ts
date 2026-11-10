var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var Active = require('@dnd-kit/core').Active;
var DataRef = require('@dnd-kit/core').DataRef;
var Over = require('@dnd-kit/core').Over;
var ColumnDragData = require('@/components/kanban/board-column').ColumnDragData;
var TaskDragData = require('@/components/kanban/task-card').TaskDragData;

type DraggableData = ColumnDragData | TaskDragData;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}


// Formed using common development resources
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// Formed using common development resources
function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return "" + (time) + " - " + (formattedDate) + "";
}

// Formed using common development resources
function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return "" + (threadCount) + " " + (threadWord) + "";
  }
}