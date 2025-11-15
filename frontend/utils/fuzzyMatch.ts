/**
 * Fuzzy string matching utilities
 * Similar to Python's fuzzywuzzy library
 */

export interface FuzzyMatch<T> {
  item: T;
  score: number;
  original: string;
  matched: string;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity ratio between two strings (0-100)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const normalized1 = str1.toLowerCase().trim();
  const normalized2 = str2.toLowerCase().trim();

  if (normalized1 === normalized2) return 100;

  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);

  if (maxLength === 0) return 100;

  return Math.round(((maxLength - distance) / maxLength) * 100);
}

/**
 * Find the best fuzzy match from an array of items
 */
export function findBestMatch<T>(
  query: string,
  items: T[],
  getCompareString: (item: T) => string,
  options: {
    minScore?: number;
    limit?: number;
  } = {}
): FuzzyMatch<T>[] {
  const { minScore = 60, limit = 5 } = options;

  if (!query || items.length === 0) return [];

  const matches: FuzzyMatch<T>[] = items
    .map(item => {
      const compareString = getCompareString(item);
      const score = calculateSimilarity(query, compareString);

      return {
        item,
        score,
        original: query,
        matched: compareString
      };
    })
    .filter(match => match.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return matches;
}

/**
 * Find a single best match (convenience function)
 */
export function findBestSingleMatch<T>(
  query: string,
  items: T[],
  getCompareString: (item: T) => string,
  minScore: number = 70
): FuzzyMatch<T> | null {
  const matches = findBestMatch(query, items, getCompareString, { minScore, limit: 1 });
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Extract words from a string for partial matching
 */
export function extractWords(str: string): string[] {
  return str.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2); // filter out very short words
}

/**
 * Calculate partial match score (checks if query words appear in target)
 */
export function calculatePartialMatch(query: string, target: string): number {
  const queryWords = extractWords(query);
  const targetWords = extractWords(target);

  if (queryWords.length === 0) return 0;

  let matchedWords = 0;
  queryWords.forEach(queryWord => {
    if (targetWords.some(targetWord =>
      targetWord.includes(queryWord) || queryWord.includes(targetWord)
    )) {
      matchedWords++;
    }
  });

  return Math.round((matchedWords / queryWords.length) * 100);
}

/**
 * Enhanced matching that considers both full similarity and partial matches
 */
export function findEnhancedMatch<T>(
  query: string,
  items: T[],
  getCompareString: (item: T) => string,
  minScore: number = 60
): FuzzyMatch<T> | null {
  const matches = findBestMatch(query, items, getCompareString, { minScore, limit: 10 });

  if (matches.length === 0) return null;

  // If we have a very high confidence match, return it
  if (matches[0].score >= 90) return matches[0];

  // Otherwise, consider partial matches as well
  const enhancedMatches = matches.map(match => {
    const partialScore = calculatePartialMatch(query, match.matched);
    const finalScore = Math.max(match.score, partialScore);

    return {
      ...match,
      score: finalScore
    };
  });

  enhancedMatches.sort((a, b) => b.score - a.score);

  return enhancedMatches[0].score >= minScore ? enhancedMatches[0] : null;
}