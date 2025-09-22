import { supabase } from '../supabase/client';
import { RangeDetermination, DimensionResult, DetailedTestResult } from '../types/range';

export class RangeAnalysisService {
  static async analyzeTestResults(userId: string): Promise<{ result: DetailedTestResult; error: string | null }> {
    try {
      console.log('=== RANGE ANALYSIS SERVICE START ===');
      console.log('Starting analysis for userId:', userId);
      
      // Get user test results (column totals)
      const { data: userResults, error: userError } = await supabase
        .from('user_test_responses')
        .select('question_id, option_id, points')
        .eq('user_id', userId);

      console.log('User results query:', { userResults, userError });

      if (userError) {
        console.error('User results error:', userError);
        throw userError;
      }
      if (!userResults?.length) {
        console.error('No test results found for user:', userId);
        throw new Error('No test results found');
      }

      // SIMPLE APPROACH - JUST USE THE ACTUAL RESPONSES
      console.log('User responses:', userResults);
      
      // Calculate total score from all responses
      const totalScore = userResults.reduce((sum, response) => sum + response.points, 0);
      console.log('Total score from responses:', totalScore);
      
      // Create simple dimension results with hardcoded scores for testing
      const dimensions = [
        'Task receptivity orientation',
        'Task ownership orientation', 
        'Values spending time to shape tasks',
        'Puts task in reality context',
        'Prepares for resources before hand',
        'Sets milestones and measures for critical stages of task',
        'Sets teams around tasks',
        'Focus on completion of tasks'
      ];

      // Per-dimension range thresholds based on provided conditions
      // Logic: if score >= highMin => High; else if avgMin <= score <= avgMax => Average; else => Low
      const perDimensionThresholds: Record<string, { lowLabel: string; avgLabel: string; highLabel: string; avgMin: number; avgMax: number; highMin: number }> = {
        'Task receptivity orientation': {
          lowLabel: '>7 to 8',
          avgLabel: '10–13',
          highLabel: '14 to ≥17',
          avgMin: 10, avgMax: 13, highMin: 14,
        },
        'Task ownership orientation': {
          lowLabel: '>7 to 8',
          avgLabel: '9–11',
          highLabel: '12 to ≥14',
          avgMin: 9, avgMax: 11, highMin: 12,
        },
        'Values spending time to shape tasks': {
          lowLabel: '>5 to 8',
          avgLabel: '9–11',
          highLabel: '12 to ≥14',
          avgMin: 9, avgMax: 11, highMin: 12,
        },
        'Puts task in reality context': {
          lowLabel: '>3 to 5',
          avgLabel: '6–8',
          highLabel: '9 to ≥12',
          avgMin: 6, avgMax: 8, highMin: 9,
        },
        'Prepares for resources before hand': {
          lowLabel: '>4 to 5',
          avgLabel: '6–8',
          highLabel: '9 to ≥11',
          avgMin: 6, avgMax: 8, highMin: 9,
        },
        'Sets milestones and measures for critical stages of task': {
          lowLabel: '>6 to 7',
          avgLabel: '8–10',
          highLabel: '11 to ≥13',
          avgMin: 8, avgMax: 10, highMin: 11,
        },
        'Sets teams around tasks': {
          lowLabel: '>5 to 6',
          avgLabel: '7–10',
          highLabel: '11 to ≥13',
          avgMin: 7, avgMax: 10, highMin: 11,
        },
        'Focus on completion of tasks': {
          lowLabel: '>4 to 6',
          avgLabel: '7–10',
          highLabel: '11 to ≥13',
          avgMin: 7, avgMax: 10, highMin: 11,
        },
      };

      // Range determination using per-dimension thresholds
      const getRangeForScore = (score: number, dimensionName: string): { range: 'Low' | 'Average' | 'High', rangeValue: string, column: number } => {
        const t = perDimensionThresholds[dimensionName];
        if (!t) {
          // Fallback to generic mapping if not found
          if (score >= 14) return { range: 'High', rangeValue: '≥14', column: 6 };
          if (score >= 10) return { range: 'Average', rangeValue: '10–13', column: 3 };
          return { range: 'Low', rangeValue: '<10', column: 1 };
        }
        if (score >= t.highMin) {
          return { range: 'High', rangeValue: t.highLabel, column: 6 };
        }
        if (score >= t.avgMin && score <= t.avgMax) {
          return { range: 'Average', rangeValue: t.avgLabel, column: 3 };
        }
        return { range: 'Low', rangeValue: t.lowLabel, column: 1 };
      };

      // Create dimension results with test scores
      const dimensionResults: DimensionResult[] = [];
      
      for (let i = 0; i < dimensions.length; i++) {
        // Use a simple test score for now
        const testScore = (i + 1) * 2; // 2, 4, 6, 8, 10, 12, 14, 16
        const dimensionName = dimensions[i];
        const { range, rangeValue, column } = getRangeForScore(testScore, dimensionName);
        
        dimensionResults.push({
          dimensionName,
          score: testScore,
          column,
          range,
          rangeValue
        });
      }

      // Get user data
      const { data: user, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userDataError) {
        console.error('User data error:', userDataError);
        throw userDataError;
      }

      // Get latest test session
      const { data: session, error: sessionError } = await supabase
        .from('user_test_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError) {
        console.error('Session data error:', sessionError);
        throw sessionError;
      }

      // Build final result
      const result: DetailedTestResult = {
        userId,
        user,
        session,
        responses: userResults,
        questions: [], // We don't need questions for detailed analysis
        totalScore: totalScore, // Use the actual total score from responses
        maxPossibleScore: 70, // 7 questions × 10 points each
        completionRate: 100, // Assuming all questions answered
        highPerformanceDimensions: dimensionResults.filter(d => d.range === 'High').length,
        dimensionResults,
        rangeResponses: [] // Not needed with hardcoded logic
      };

      console.log('=== RANGE ANALYSIS SERVICE SUCCESS ===');
      console.log('Final result:', result);
      return { result, error: null };
    } catch (error) {
      console.error('Error analyzing test results:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        error: error
      });
      return { result: null as unknown as DetailedTestResult, error: error instanceof Error ? error.message : `Unknown error: ${JSON.stringify(error)}` };
    }
  }

  // Check if a score falls within a range
  private static isScoreInRange(score: number, range: string): boolean {
    if (!range) return false;

    console.log(`Checking if score ${score} matches range "${range}"`);

    // Handle different range formats
    if (range.includes('>=')) {
      const threshold = parseInt(range.replace('>=', ''));
      const matches = score >= threshold;
      console.log(`  >= ${threshold}: ${matches}`);
      return matches;
    } else if (range.includes('<=')) {
      const threshold = parseInt(range.replace('<=', ''));
      const matches = score <= threshold;
      console.log(`  <= ${threshold}: ${matches}`);
      return matches;
    } else if (range.includes('>')) {
      const threshold = parseInt(range.replace('>', ''));
      const matches = score > threshold;
      console.log(`  > ${threshold}: ${matches}`);
      return matches;
    } else if (range.includes('<')) {
      const threshold = parseInt(range.replace('<', ''));
      const matches = score < threshold;
      console.log(`  < ${threshold}: ${matches}`);
      return matches;
    } else if (range.includes('-')) {
      const [min, max] = range.split('-').map(n => parseInt(n.trim()));
      const matches = score >= min && score <= max;
      console.log(`  ${min}-${max}: ${matches}`);
      return matches;
    } else {
      // Single number
      const exact = parseInt(range);
      const matches = score === exact;
      console.log(`  = ${exact}: ${matches}`);
      return matches;
    }
  }

  // Determine which column (1-7) a score falls into
  private static getColumnForScore(score: number, determination: RangeDetermination): number {
    console.log(`\nDetermining column for score ${score} in dimension "${determination.dimension_name}"`);
    
    const columns = [
      determination.column_1,
      determination.column_2,
      determination.column_3,
      determination.column_4,
      determination.column_5,
      determination.column_6,
      determination.column_7
    ];

    console.log('Available ranges:', columns);

    // Check each column in order and return the first match
    for (let i = 0; i < columns.length; i++) {
      if (this.isScoreInRange(score, columns[i])) {
        console.log(`  → Matched column ${i + 1} with range "${columns[i]}"`);
        return i + 1; // Return 1-based column number
      }
    }

    console.log(`  → No match found, using fallback logic`);
    // Fallback logic: >=7 and 8-9 = Low, 10-13 = Average, 14-<=17 = High
    if (score >= 7 && score <= 9) return 1; // >=7 and 8-9 falls in column 1 (Low)
    if (score >= 10 && score <= 13) return 3; // 10-13 falls in column 3 (Average)
    if (score >= 14 && score <= 17) return 6; // 14-<=17 falls in column 6 (High)
    
    // Handle edge cases
    if (score < 7) return 1; // Less than 7 = Low
    if (score > 17) return 7; // More than 17 = High
    
    // Default to column 4 (middle of average range) if no match
    return 4;
  }

  // Determine range (Low/Average/High) based on column
  // Column 1-2: Low (>=7 and 8-9)
  // Column 3-5: Average (10 to 13) 
  // Column 6-7: High (14 to <=17)
  private static getRangeFromColumn(column: number): 'Low' | 'Average' | 'High' {
    if (column <= 2) return 'Low';      // Columns 1-2: Low
    if (column <= 5) return 'Average';  // Columns 3-5: Average  
    return 'High';                      // Columns 6-7: High
  }

  // Get the range value string for a specific column
  private static getRangeValueForColumn(column: number, determination: RangeDetermination): string {
    const columns = [
      determination.column_1,
      determination.column_2,
      determination.column_3,
      determination.column_4,
      determination.column_5,
      determination.column_6,
      determination.column_7
    ];
    
    return columns[column - 1] || '';
  }

  // Calculate column totals from user responses - SIMPLIFIED APPROACH
  private static calculateColumnTotals(responses: Array<{question_id: number; option_id: number; points: number}>): number[] {
    console.log('=== CALCULATING COLUMN TOTALS ===');
    console.log('Raw responses:', responses);
    console.log('Number of responses:', responses.length);
    
    // Initialize totals for 8 columns (A-H)
    const columnTotals = new Array(8).fill(0);
    
    // Group responses by question
    const responsesByQuestion: Record<number, Array<{question_id: number; option_id: number; points: number}>> = responses.reduce((acc, response) => {
      if (!acc[response.question_id]) {
        acc[response.question_id] = [];
      }
      acc[response.question_id].push(response);
      return acc;
    }, {} as Record<number, Array<{question_id: number; option_id: number; points: number}>>);

    console.log('Responses grouped by question:', responsesByQuestion);

    // Process each question
    for (let questionId = 1; questionId <= 7; questionId++) {
      const questionResponses = responsesByQuestion[questionId] || [];
      console.log(`\nProcessing Question ${questionId}:`, questionResponses);
      
      // Sort responses by option_id to ensure consistent order
      questionResponses.sort((a: {option_id: number}, b: {option_id: number}) => a.option_id - b.option_id);
      
      // Add points to each column based on option order
      questionResponses.forEach((response: {option_id: number; points: number}, index: number) => {
        if (index < 8) { // Only process first 8 options
          columnTotals[index] += response.points;
          console.log(`  Option ${response.option_id} (position ${index}): ${response.points} points -> Column ${index} total: ${columnTotals[index]}`);
        }
      });
    }

    console.log('Final column totals:', columnTotals);
    console.log('=== END COLUMN TOTALS ===\n');
    return columnTotals;
  }
}