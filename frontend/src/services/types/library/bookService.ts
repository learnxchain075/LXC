/**
 * Book type enum
 */
export enum BookType {
  TEXTBOOK = 'TEXTBOOK',
  REFERENCE = 'REFERENCE',
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  MAGAZINE = 'MAGAZINE',
  JOURNAL = 'JOURNAL'
}

/**
 * Book interface matching backend schema
 */
export interface IBook {
  id: string;
  title: string;
  isbn?: string;
  publicationDate?: Date;
  genre?: string;
  type: BookType;
  department?: string;
  class?: string;
  subject?: string;
  edition?: string;
  nextEditionCheck?: Date;
  libraryId: string;
  authors: IBookAuthor[];
  copies: IBookCopy[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Book author interface
 */
export interface IBookAuthor {
  bookId: string;
  authorId: string;
  author: IAuthor;
}

/**
 * Author interface
 */
export interface IAuthor {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Book copy status enum
 */
export enum BookCopyStatus {
  AVAILABLE = 'AVAILABLE',
  ISSUED = 'ISSUED',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST'
}

/**
 * Book copy interface
 */
export interface IBookCopy {
  id: string;
  bookId: string;
  accessionNumber: string;
  status: BookCopyStatus;
  issues: IBookIssue[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create book input interface
 */
export interface ICreateBook {
  title: string;
  isbn?: string;
  publicationDate?: Date;
  genre?: string;
  type: BookType;
  department?: string;
  class?: string;
  subject?: string;
  edition?: string;
  libraryId: string;
  authors: string[];
  numberOfCopies: number;
}

/**
 * Update book input interface
 */
export type IUpdateBook = Partial<Omit<IBook, 'id' | 'createdAt' | 'updatedAt' | 'authors' | 'copies'>>

/**
 * Book issue interface
 */
export interface IBookIssue {
  id: string;
  bookCopyId: string;
  userId: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BookIssueStatus;
  fine?: IFine;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Book issue status enum
 */
export enum BookIssueStatus {
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST'
}

/**
 * Fine interface
 */
export interface IFine {
  id: string;
  bookIssueId: string;
  amount: number;
  status: FineStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fine status enum
 */
export enum FineStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  WAIVED = 'WAIVED'
}

/**
 * Book search filter interface
 */
export interface IBookFilter {
  type?: BookType;
  genre?: string;
  department?: string;
  class?: string;
  subject?: string;
  publishedAfter?: Date;
  publishedBefore?: Date;
  available?: boolean;
}

/**
 * Book issue request interface
 */
export interface IBookIssueRequest {
  userId: string;
  bookId: string;
  dueDate: Date;
  remarks?: string;
}

/**
 * Book return request interface
 */
export interface IBookReturnRequest {
  issueId: string;
  condition: BookCopyStatus;
  remarks?: string;
}