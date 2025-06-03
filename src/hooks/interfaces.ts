// src/api/interfaces.ts

export interface Transaction {
  date: string;
  total_transactions: string;
  total_sales: string;
}

export interface TransactionsReport {
  [branchName: string]: Transaction[] | [];
}

export interface ProductSellsReport {
  product_id: string;
  product_name: string;
  total_sold: string;
  total_sales: string;
}

export interface BranchReport {
  branch_id: string;
  branch_name: string;
  total_transactions: string;
  total_sales: string;
}

export interface AllReportsResponse {
  transactions_report: TransactionsReport;
  product_sells_report: ProductSellsReport[];
  branch_report: BranchReport[];
}
