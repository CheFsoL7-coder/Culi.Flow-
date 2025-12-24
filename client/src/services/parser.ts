import type { TaskType, Station, Priority, ComplianceType, Concept } from '../types';

export interface ParsedTask {
  type?: TaskType;
  duration?: number;
  title?: string;
  quantity?: string;
  station?: Station;
  due?: string;
  owner?: string;
  priority?: Priority;
  complianceTags?: ComplianceType[];
  conceptTags?: Concept[];
}

const STATION_MAP: Record<string, Station> = {
  'garde': 'garde',
  'hotline': 'hot-line',
  'hot-line': 'hot-line',
  'bakery': 'bakery',
  'dish': 'dish',
  'utility': 'utility',
  'central': 'central-production',
  'central-production': 'central-production',
};

const CONCEPT_MAP: Record<string, Concept> = {
  'oak': 'oak-terrace',
  'elements': 'elements',
  'loons': 'loons-nest',
  'central': 'central-production',
};

const COMPLIANCE_MAP: Record<string, ComplianceType> = {
  'temp': 'temp_log',
  'testmeal': 'test_meal',
  'mealround': 'meal_round',
  'fifo': 'fifo',
};

export function parseQuickAdd(input: string): ParsedTask {
  const result: ParsedTask = {
    complianceTags: [],
    conceptTags: [],
  };

  let remainingText = input.trim();

  // Parse type (first word if it matches a type)
  const typeMatch = remainingText.match(/^(prep|service|admin|standards|compliance)\s+/i);
  if (typeMatch) {
    result.type = typeMatch[1].toLowerCase() as TaskType;
    remainingText = remainingText.substring(typeMatch[0].length);
  }

  // Parse duration (number at start)
  const durationMatch = remainingText.match(/^(\d+)\s+/);
  if (durationMatch) {
    result.duration = parseInt(durationMatch[1], 10);
    remainingText = remainingText.substring(durationMatch[0].length);
  }

  // Parse priority (!critical, !high)
  const priorityMatch = remainingText.match(/!(critical|high|medium)/i);
  if (priorityMatch) {
    result.priority = priorityMatch[1].toLowerCase() as Priority;
    remainingText = remainingText.replace(priorityMatch[0], '').trim();
  }

  // Parse owner (#name)
  const ownerMatch = remainingText.match(/#(\w+)/);
  if (ownerMatch) {
    result.owner = ownerMatch[1];
    remainingText = remainingText.replace(ownerMatch[0], '').trim();
  }

  // Parse station (@station)
  const stationMatch = remainingText.match(/@(\S+)/);
  if (stationMatch) {
    const stationKey = stationMatch[1].toLowerCase();
    result.station = STATION_MAP[stationKey];
    remainingText = remainingText.replace(stationMatch[0], '').trim();
  }

  // Parse time (9a, 14:30, etc)
  const timeMatch = remainingText.match(/(\d{1,2}):?(\d{2})?\s*(am?|pm?)?/i);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();

    let finalHour = hour;
    if (meridiem === 'pm' || meridiem === 'p') {
      finalHour = hour < 12 ? hour + 12 : hour;
    } else if (meridiem === 'am' || meridiem === 'a') {
      finalHour = hour === 12 ? 0 : hour;
    }

    const today = new Date();
    today.setHours(finalHour, minute, 0, 0);
    result.due = today.toISOString();
    remainingText = remainingText.replace(timeMatch[0], '').trim();
  }

  // Parse compliance tags (/temp, /testmeal, etc)
  const complianceMatches = remainingText.matchAll(/\/(\w+)/g);
  for (const match of complianceMatches) {
    const tag = match[1].toLowerCase();
    const complianceType = COMPLIANCE_MAP[tag];
    if (complianceType && !result.complianceTags?.includes(complianceType)) {
      result.complianceTags?.push(complianceType);
    }
    remainingText = remainingText.replace(match[0], '').trim();
  }

  // Parse concept tags (+oak, +elements, etc)
  const conceptMatches = remainingText.matchAll(/\+(\w+)/g);
  for (const match of conceptMatches) {
    const tag = match[1].toLowerCase();
    const concept = CONCEPT_MAP[tag];
    if (concept && !result.conceptTags?.includes(concept)) {
      result.conceptTags?.push(concept);
    }
    remainingText = remainingText.replace(match[0], '').trim();
  }

  // Parse quantity (e.g., 2gal, 10lb, 3qt)
  const quantityMatch = remainingText.match(/(\d+)\s?(gal|lb|qt|oz|kg|g|each)/i);
  if (quantityMatch) {
    result.quantity = quantityMatch[0];
    remainingText = remainingText.replace(quantityMatch[0], '').trim();
  }

  // Everything else is the title
  result.title = remainingText.trim();

  return result;
}

// Example usage:
// parseQuickAdd("prep 10 chicken stock 2gal @garde 9a #mike !critical /temp +oak")
// Result:
// {
//   type: "prep",
//   duration: 10,
//   title: "chicken stock",
//   quantity: "2gal",
//   station: "garde",
//   due: "2024-...",
//   owner: "mike",
//   priority: "critical",
//   complianceTags: ["temp_log"],
//   conceptTags: ["oak-terrace"]
// }
