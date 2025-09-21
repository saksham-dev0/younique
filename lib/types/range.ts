export interface RangeDetermination {
  id: string;
  dimension_name: string;
  dimension_order: number;
  column_1: string;
  column_2: string;
  column_3: string;
  column_4: string;
  column_5: string;
  column_6: string;
  column_7: string;
  created_at: string;
}

export interface RangeResponse {
  id: string;
  dimension_name: string;
  dimension_order: number;
  average_description: string;
  high_description: string;
  low_description: string;
  created_at: string;
}

export interface DimensionResult {
  dimensionName: string;
  score: number;
  range: 'Low' | 'Average' | 'High';
  column: number;
  rangeValue: string;
}

export interface DetailedTestResult {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
    completed_at: string;
  };
  responses: Array<{
    question_id: number;
    option_id: number;
    points: number;
  }>;
  questions: Array<{
    id: number;
    question_text: string;
  }>;
  totalScore: number;
  maxPossibleScore: number;
  completionRate: number;
  highPerformanceDimensions: number;
  dimensionResults: DimensionResult[];
  rangeResponses: RangeResponse[];
}
