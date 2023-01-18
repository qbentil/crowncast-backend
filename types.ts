export interface MailUser {
  name: string;
  email: string;
  password?: string;
  role: string;
  site?: string;
}

export interface MailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  htmlText?: string;
}

export interface ICategory {
  title: String;
  description: String;
  event: IEvent;
  is_deleted: boolean;
}

export interface IContestant {
  name: String;
  image: String;
  biography: String;
  code: String;
  votes: number;
  event: IEvent;
}

export interface IEvent {
  name: String;
  description: String;
  banner: String;
  vote_price: String;
  votes: number;
  opening_date: Date;
  closing_date: Date;
  is_deleted: boolean;
  organizer: IOrganizer;
}
export interface ICompany {
  name: String;
  address: String;
  phone: String;
}

export interface IOrganizer {
  avatar: String;
  name: String;
  email: String;
  phone: String;
  company: ICompany;
  password: String;
  address: String;
  token: String;
  is_deleted: boolean;
  status: String;
}

export interface IFindCategoryParam {
  title: String;
  event: IEvent;
}

export interface ICreateCategoryParam {
  title:String;
  event :IEvent;
  description :String;
}