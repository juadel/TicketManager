export interface TicketItem {
    userID: string
    ticket: string
    CustomerName: string
    createdAt: string
    Title: string
    Description: string
    dueDate: string
    Status: boolean
    Comments: Array<string>
    attachmentUrl?: string
  }
  