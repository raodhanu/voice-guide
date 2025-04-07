import {
  CheckHealthData,
  DubaiQueryRequest,
  GetGoogleMapsApiKeyData,
  LocationQueryRequest,
  ProcessDubaiQueryData,
  QueryLocationData,
  StreamDubaiResponseData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Process a user query about Dubai and return relevant information
   * @tags dbtn/module:dubai_assistant
   * @name process_dubai_query
   * @summary Process Dubai Query
   * @request POST:/routes/dubai-assistant/query
   */
  export namespace process_dubai_query {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DubaiQueryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ProcessDubaiQueryData;
  }

  /**
   * @description Stream a response to a Dubai query for a more interactive experience
   * @tags stream, dbtn/module:dubai_assistant
   * @name stream_dubai_response
   * @summary Stream Dubai Response
   * @request POST:/routes/dubai-assistant/stream
   */
  export namespace stream_dubai_response {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DubaiQueryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = StreamDubaiResponseData;
  }

  /**
   * @description Process a location query and return relevant information
   * @tags dbtn/module:dubai_locations
   * @name query_location
   * @summary Query Location
   * @request POST:/routes/dubai-locations/query
   */
  export namespace query_location {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LocationQueryRequest;
    export type RequestHeaders = {};
    export type ResponseBody = QueryLocationData;
  }

  /**
   * @description Get the Google Maps API key. This endpoint should only be called from the frontend.
   * @tags dbtn/module:google_maps
   * @name get_google_maps_api_key
   * @summary Get Google Maps Api Key
   * @request GET:/routes/api-key
   */
  export namespace get_google_maps_api_key {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetGoogleMapsApiKeyData;
  }
}
