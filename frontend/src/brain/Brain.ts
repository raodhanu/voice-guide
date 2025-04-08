import {
  CheckHealthData,
  DubaiQueryRequest,
  GetGoogleMapsApiKeyData,
  LocationQueryRequest,
  ProcessDubaiQueryData,
  ProcessDubaiQueryError,
  QueryLocationData,
  QueryLocationError,
  StreamDubaiResponseData,
  StreamDubaiResponseError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:dubai_assistant
   * @name process_dubai_query
   * @summary Process Dubai Query
   * @request POST:/routes/dubai-assistant/query
   */
  process_dubai_query = (data: DubaiQueryRequest, params: RequestParams = {}) =>
    this.request<ProcessDubaiQueryData, ProcessDubaiQueryError>({
      path: `/routes/dubai-assistant/query`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Stream a response to a Dubai query for a more interactive experience
   *
   * @tags stream, dbtn/module:dubai_assistant
   * @name stream_dubai_response
   * @summary Stream Dubai Response
   * @request POST:/routes/dubai-assistant/stream
   */
  stream_dubai_response = (data: DubaiQueryRequest, params: RequestParams = {}) =>
    this.requestStream<StreamDubaiResponseData, StreamDubaiResponseError>({
      path: `/routes/dubai-assistant/stream`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:google_maps
   * @name get_google_maps_api_key
   * @summary Get Google Maps Api Key
   * @request GET:/routes/api-key
   */
  get_google_maps_api_key = (params: RequestParams = {}) =>
    this.request<GetGoogleMapsApiKeyData, any>({
      path: `/routes/api-key`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:dubai_locations
   * @name query_location
   * @summary Query Location
   * @request POST:/routes/dubai-locations/query
   */
  query_location = (data: LocationQueryRequest, params: RequestParams = {}) =>
    this.request<QueryLocationData, QueryLocationError>({
      path: `/routes/dubai-locations/query`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
