import type { NextRequest } from "next/server"
import { postgrestClient } from "./postgrest"

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export function isEnvConfigured(): boolean {
  const requiredVars = ["POSTGREST_URL", "POSTGREST_SCHEMA", "POSTGREST_API_KEY"]
  const missing = requiredVars.filter((varName) => !process.env[varName])
  return missing.length === 0
}

export function getMissingEnvVars(): string[] {
  const requiredVars = ["POSTGREST_URL", "POSTGREST_SCHEMA", "POSTGREST_API_KEY"]
  return requiredVars.filter((varName) => !process.env[varName])
}

export function validateEnv(): void {
  if (!isEnvConfigured()) {
    const missing = getMissingEnvVars()
    throw new Error(`Database not configured. Missing environment variables: ${missing.join(", ")}`)
  }
}

// 标准化错误响应
export function errorResponse(error: string, status = 500): Response {
  console.error("API Error:", error)
  return Response.json({ success: false, error } as ApiResponse, { status })
}

// 标准化成功响应
export function successResponse<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data } as ApiResponse<T>, { status })
}

export function mockDataResponse<T>(mockData: T, message?: string): Response {
  return Response.json(
    {
      success: true,
      data: mockData,
      warning: message || "Using mock data - database not configured",
    } as ApiResponse<T> & { warning: string },
    { status: 200 },
  )
}

// 解析查询参数
export function parseQueryParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  return {
    limit: Number.parseInt(searchParams.get("limit") || "10"),
    offset: Number.parseInt(searchParams.get("offset") || "0"),
    id: searchParams.get("id"),
    search: searchParams.get("search"),
  }
}

// 验证请求体
export async function validateRequestBody(request: NextRequest): Promise<any> {
  try {
    const body = await request.json()

    if (!body || typeof body !== "object") {
      throw new Error("Invalid request body")
    }

    return body
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON in request body")
    }
    throw error
  }
}

// 通用CRUD操作包装器
export class CrudOperations {
  constructor(private tableName: string) {}

  async findMany(filters?: Record<string, any>, limit?: number, offset?: number) {
    if (!isEnvConfigured()) {
      throw new Error(`Database not configured. Cannot fetch ${this.tableName}.`)
    }

    validateEnv()

    let query = postgrestClient.from(this.tableName).select("*")

    // 应用过滤器
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    // 应用分页
    if (limit && offset !== undefined) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`)
    }

    return data
  }

  async findById(id: string | number) {
    if (!isEnvConfigured()) {
      throw new Error(`Database not configured. Cannot fetch ${this.tableName} by id.`)
    }

    validateEnv()

    const { data, error } = await postgrestClient.from(this.tableName).select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // 未找到记录
      }
      throw new Error(`Failed to fetch ${this.tableName} by id: ${error.message}`)
    }

    return data
  }

  async create(data: Record<string, any>) {
    if (!isEnvConfigured()) {
      throw new Error(`Database not configured. Cannot create ${this.tableName}.`)
    }

    validateEnv()

    const { data: result, error } = await postgrestClient.from(this.tableName).insert([data]).select().single()

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`)
    }

    return result
  }

  async update(id: string | number, data: Record<string, any>) {
    if (!isEnvConfigured()) {
      throw new Error(`Database not configured. Cannot update ${this.tableName}.`)
    }

    validateEnv()

    const { data: result, error } = await postgrestClient
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`)
    }

    return result
  }

  async delete(id: string | number) {
    if (!isEnvConfigured()) {
      throw new Error(`Database not configured. Cannot delete ${this.tableName}.`)
    }

    validateEnv()

    const { error } = await postgrestClient.from(this.tableName).delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`)
    }

    return { id }
  }
}

// API 路由处理器包装器
export function withErrorHandling(handler: (request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error("Unhandled API error:", error)

      if (error instanceof Error) {
        if (error.message.includes("Database not configured")) {
          return errorResponse(error.message, 503) // Service Unavailable
        }
        return errorResponse(error.message)
      }

      return errorResponse("Internal server error")
    }
  }
}
