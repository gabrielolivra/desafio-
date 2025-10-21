export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: { [key: string]: 1 | -1 };
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PaginationHelper {
  static DEFAULT_PAGE = 1;
  static DEFAULT_LIMIT = 10;

  static getPaginationOptions(options?: PaginationOptions): Required<PaginationOptions> {
    return {
      page: Math.max(options?.page || this.DEFAULT_PAGE, 1),
      limit: Math.max(options?.limit || this.DEFAULT_LIMIT, 1),
      sort: options?.sort || { _id: 1 }
    };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static async paginate<T>(
    findFn: () => Promise<T[]>,
    countFn: () => Promise<number>,
    options?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const { page, limit, sort } = this.getPaginationOptions(options);
    const skip = this.getSkip(page, limit);

    const [data, total] = await Promise.all([
      findFn(),
      countFn()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}