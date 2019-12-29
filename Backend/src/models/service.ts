export interface ServiceItem {
    userID: string
    ServiceID: string
    CustomerName: string
    createdAt: string
    Title: string
    Description: string
    dueDate: string
    Status: boolean
    Comments: Array<string>
    attachmentUrl?: string
  }
  