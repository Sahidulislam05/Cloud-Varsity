export type TCreateFeeStructurePayload = {
  title: string;
  amount: number;
  programId: string;
  semesterId: string;
};

export type TGenerateInvoicesPayload = {
  dueDate: string;
};

export type TInvoiceListQuery = {
  page?: string;
  limit?: string;
  status?: string;
};
