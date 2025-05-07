// file: type.ts
export default interface IRegister {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string; // tambahkan ini
  referral_code: string;
}
