/** DirectionsInfo */
export interface DirectionsInfo {
  origin: Location;
  destination: Location;
  /** Distance Text */
  distance_text: string;
  /** Duration Text */
  duration_text: string;
  /** Steps */
  steps: string[];
}

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
  /** Cultural etiquette information if the query is about cultural customs */
  etiquette_info?: EtiquetteInfo | null;
}

/** EtiquetteInfo */
export interface EtiquetteInfo {
  /**
   * Category
   * The category of etiquette information
   */
  category: string;
  /**
   * Advice
   * The main advice about this etiquette category
   */
  advice: string;
  /**
   * Additional Info
   * Additional information about the etiquette
   */
  additional_info?: string | null;
  /**
   * Do Tips
   * List of things to do
   */
  do_tips?: string[] | null;
  /**
   * Dont Tips
   * List of things not to do
   */
  dont_tips?: string[] | null;
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

/** Location */
export interface Location {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Category */
  category: string;
  /** Location */
  location: Record<string, number>;
  /** Description */
  description: string;
  /** Image Url */
  image_url?: string | null;
}

/** LocationQueryRequest */
export interface LocationQueryRequest {
  /**
   * Query
   * The user's query about a location in Dubai
   */
  query: string;
  /**
   * Current Location
   * The user's current location (lat/lng) if available
   */
  current_location?: Record<string, number> | null;
}

/** LocationQueryResponse */
export interface LocationQueryResponse {
  /** Locations */
  locations?: Location[];
  /** Primary Location */
  primary_location?: string | null;
  directions?: DirectionsInfo | null;
  /**
   * Map Center
   * @default {"lat":25.2048,"lng":55.2708}
   */
  map_center?: Record<string, number>;
  /**
   * Zoom Level
   * @default 11
   */
  zoom_level?: number;
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

export type GetGoogleMapsApiKeyData = any;

export type QueryLocationData = LocationQueryResponse;

export type QueryLocationError = HTTPValidationError;
