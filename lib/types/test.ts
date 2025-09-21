export interface TestQuestion {
  id: string;
  question_text: string;
  question_order: number;
  created_at: string;
}

export interface TestOption {
  id: string;
  question_id: string;
  option_text: string;
  option_order: number;
  created_at: string;
}

export interface UserTestResponse {
  id?: string;
  user_id: string;
  question_id: string;
  option_id: string;
  points: number;
  created_at?: string;
}

export interface TestSession {
  id?: string;
  user_id: string;
  completed_at?: string;
  total_score?: number;
}

export interface QuestionWithOptions extends TestQuestion {
  options: TestOption[];
}

export interface TestResponse {
  questionId: string;
  optionId: string;
  points: number;
}

export interface TestSubmission {
  responses: TestResponse[];
  sessionId?: string;
}
