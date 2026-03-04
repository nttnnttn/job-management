/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUserDto {
  password: string;
  /** @format email */
  email: string;
  role: "candidate" | "recruiter";
}

export interface UserDto {
  email: string;
}

export interface PaginatedUserDto {
  total: number;
  limit: number;
  offset: number;
  results: UserDto[];
}

export interface UpdateUserDto {
  password?: string;
  /** @format email */
  email?: string;
  role?: "candidate" | "recruiter";
}

export interface LoginDto {
  password: string;
  email: string;
}

export interface LoginReponseDto {
  access_token: string;
}

export interface CreateCandidateDto {
  email: string;
  fullName: string;
  skills: string[];
  status: "active" | "inactive";
}

export interface UpdateCandidateDto {
  email?: string;
  fullName?: string;
  skills?: string[];
  status?: "active" | "inactive";
}

export type CreateJobDto = object;

export type UpdateJobDto = object;

export type CreateJobCandidateDto = object;

export type UpdateJobCandidateDto = object;

export type AppControllerGetHelloError = string;

export type UsersControllerCreateBulkData = CreateUserDto[];

export type UsersControllerCreateBulkError = CreateUserDto[];

export type UsersControllerSearchAllData = PaginatedUserDto;

export type UsersControllerFindOneError = object;

export type UsersControllerUpdateError = string;

export type UsersControllerRemoveError = string;

export type UsersControllerGetProfileError = object;

export type AuthControllerSignInError = LoginReponseDto;

export type AuthControllerRegisterData = any;

export type AuthControllerRegisterError = string;

export type CandidatesControllerCreateError = object;

export type CandidatesControllerFindAllError = string;

export type CandidatesControllerUpdateError = object;

export type CandidatesControllerRemoveError = object;

export type CandidatesControllerGetCandidateByEmailError = object;

export type JobsControllerCreateError = string;

export type JobsControllerFindAllError = object[];

export type JobsControllerFindOneError = object;

export type JobsControllerUpdateError = object;

export type JobsControllerRemoveError = object;

export type JobCandidateControllerCreateError = string;

export type JobCandidateControllerFindAllError = string;

export type JobCandidateControllerFindOneError = string;

export type JobCandidateControllerUpdateError = string;

export type JobCandidateControllerRemoveError = string;

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Swagger API
 * @version 1.0
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags App
   * @name AppControllerGetHello
   * @request GET:/
   * @secure
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<any, AppControllerGetHelloError>({
      path: `/`,
      method: "GET",
      secure: true,
      ...params,
    });

  users = {
    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerCreateBulk
     * @request POST:/users/bulk
     * @secure
     */
    usersControllerCreateBulk: (
      data: CreateUserDto[],
      params: RequestParams = {},
    ) =>
      this.request<
        UsersControllerCreateBulkData,
        UsersControllerCreateBulkError
      >({
        path: `/users/bulk`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerSearchAll
     * @request GET:/users/search
     * @secure
     */
    usersControllerSearchAll: (params: RequestParams = {}) =>
      this.request<UsersControllerSearchAllData, void>({
        path: `/users/search`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindOne
     * @request GET:/users/{id}
     * @secure
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<any, UsersControllerFindOneError>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdate
     * @request PATCH:/users/{id}
     * @secure
     */
    usersControllerUpdate: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<any, UsersControllerUpdateError>({
        path: `/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerRemove
     * @request DELETE:/users/{id}
     * @secure
     */
    usersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<any, UsersControllerRemoveError>({
        path: `/users/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerGetAllUsers
     * @request GET:/users
     * @secure
     */
    usersControllerGetAllUsers: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerGetProfile
     * @request GET:/users/me
     * @secure
     */
    usersControllerGetProfile: (params: RequestParams = {}) =>
      this.request<any, UsersControllerGetProfileError>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerSignIn
     * @request POST:/users/login
     * @secure
     */
    authControllerSignIn: (data: LoginDto, params: RequestParams = {}) =>
      this.request<any, AuthControllerSignInError>({
        path: `/users/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @request POST:/users/register
     * @secure
     */
    authControllerRegister: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<AuthControllerRegisterData, AuthControllerRegisterError>({
        path: `/users/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  candidates = {
    /**
     * No description
     *
     * @tags Candidates
     * @name CandidatesControllerCreate
     * @request POST:/candidates
     * @secure
     */
    candidatesControllerCreate: (
      data: CreateCandidateDto,
      params: RequestParams = {},
    ) =>
      this.request<any, CandidatesControllerCreateError>({
        path: `/candidates`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Candidates
     * @name CandidatesControllerFindAll
     * @request GET:/candidates
     * @secure
     */
    candidatesControllerFindAll: (params: RequestParams = {}) =>
      this.request<any, CandidatesControllerFindAllError>({
        path: `/candidates`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Candidates
     * @name CandidatesControllerUpdate
     * @request PATCH:/candidates/{id}
     * @secure
     */
    candidatesControllerUpdate: (
      id: string,
      data: UpdateCandidateDto,
      params: RequestParams = {},
    ) =>
      this.request<any, CandidatesControllerUpdateError>({
        path: `/candidates/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Candidates
     * @name CandidatesControllerRemove
     * @request DELETE:/candidates/{id}
     * @secure
     */
    candidatesControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<any, CandidatesControllerRemoveError>({
        path: `/candidates/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Candidates
     * @name CandidatesControllerGetCandidateByEmail
     * @request GET:/candidates/email
     * @secure
     */
    candidatesControllerGetCandidateByEmail: (
      email: string,
      params: RequestParams = {},
    ) =>
      this.request<any, CandidatesControllerGetCandidateByEmailError>({
        path: `/candidates/email`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  jobs = {
    /**
     * No description
     *
     * @tags Jobs
     * @name JobsControllerCreate
     * @request POST:/jobs
     * @secure
     */
    jobsControllerCreate: (data: CreateJobDto, params: RequestParams = {}) =>
      this.request<any, JobsControllerCreateError>({
        path: `/jobs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs
     * @name JobsControllerFindAll
     * @request GET:/jobs
     * @secure
     */
    jobsControllerFindAll: (
      query?: {
        q?: string;
        location?: string;
        minSalary?: number;
        maxSalary?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, JobsControllerFindAllError>({
        path: `/jobs`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs
     * @name JobsControllerFindOne
     * @request GET:/jobs/{id}
     * @secure
     */
    jobsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<any, JobsControllerFindOneError>({
        path: `/jobs/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs
     * @name JobsControllerUpdate
     * @request PATCH:/jobs/{id}
     * @secure
     */
    jobsControllerUpdate: (
      id: string,
      data: UpdateJobDto,
      params: RequestParams = {},
    ) =>
      this.request<any, JobsControllerUpdateError>({
        path: `/jobs/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs
     * @name JobsControllerRemove
     * @request DELETE:/jobs/{id}
     * @secure
     */
    jobsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<any, JobsControllerRemoveError>({
        path: `/jobs/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  jobCandidate = {
    /**
     * No description
     *
     * @tags JobCandidate
     * @name JobCandidateControllerCreate
     * @request POST:/job-candidate
     * @secure
     */
    jobCandidateControllerCreate: (
      data: CreateJobCandidateDto,
      params: RequestParams = {},
    ) =>
      this.request<any, JobCandidateControllerCreateError>({
        path: `/job-candidate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags JobCandidate
     * @name JobCandidateControllerFindAll
     * @request GET:/job-candidate
     * @secure
     */
    jobCandidateControllerFindAll: (params: RequestParams = {}) =>
      this.request<any, JobCandidateControllerFindAllError>({
        path: `/job-candidate`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags JobCandidate
     * @name JobCandidateControllerFindOne
     * @request GET:/job-candidate/{id}
     * @secure
     */
    jobCandidateControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<any, JobCandidateControllerFindOneError>({
        path: `/job-candidate/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags JobCandidate
     * @name JobCandidateControllerUpdate
     * @request PATCH:/job-candidate/{id}
     * @secure
     */
    jobCandidateControllerUpdate: (
      id: string,
      data: UpdateJobCandidateDto,
      params: RequestParams = {},
    ) =>
      this.request<any, JobCandidateControllerUpdateError>({
        path: `/job-candidate/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags JobCandidate
     * @name JobCandidateControllerRemove
     * @request DELETE:/job-candidate/{id}
     * @secure
     */
    jobCandidateControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<any, JobCandidateControllerRemoveError>({
        path: `/job-candidate/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
