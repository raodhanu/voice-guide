/** DubaiQueryRequest */
export interface DubaiQueryRequest {
  /**
   * Query
   * The user's query about Dubai
   */
  query: string;
  /**
   * Language
   * The language code for the response (e.g., 'en', 'ar', 'ru', 'zh')
   * @default "en"
   */
  language?: string;
}

/** DubaiQueryResponse */
export interface DubaiQueryResponse {
  /**
   * Answer
   * The AI-generated answer about Dubai
   */
  answer: string;
  /**
   * Suggested Followups
   * Optional suggested follow-up questions
   */
  suggested_followups?: string[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type ProcessDubaiQueryData = DubaiQueryResponse;

export type ProcessDubaiQueryError = HTTPValidationError;

export type StreamDubaiResponseData = any;

export type StreamDubaiResponseError = HTTPValidationError;
