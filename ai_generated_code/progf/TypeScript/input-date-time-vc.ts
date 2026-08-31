import { valueConverter } from "aurelia";

// https://docs.aurelia.io/templates/value-converters
// Thanks ChatGPT for this one...
@valueConverter("datetimeLocal")
export class DateTimeLocalValueConverter {
  toView(value: string): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) {
      return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  fromView(value: string): string {
    if (!value) return "";
    return new Date(value).toISOString();
  }
}
