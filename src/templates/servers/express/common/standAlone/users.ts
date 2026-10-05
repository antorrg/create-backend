export const users = `export interface IUser {
  id: string
  name: string
  username: string
  email: string
  enabled: boolean
  phone: number
}
export type UserCreate = Partial<IUser>
export type UserUpdate = Omit<IUser, 'id'>
export const users = [
  {
    id: 'b110fa99-f335-440d-a948-dbf6d00630c1',
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    enabled:true,
    phone: 5578896
  },
  {
    id: '82d90334-eaf9-455b-81f4-0d9128a7939a',
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    enabled:true,
    phone: 3420219
  },
  {
    id: '58bc81b4-16b5-401a-b860-cfb99ec60559',
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    enabled:true,
    phone: 7101901
  },
  {
    id: 'dfe3c497-d86c-4ce3-b2fe-011fa2845823',
    name: 'Patricia Lebsack',
    username: 'Karianne',
    email: 'Julianne.OConner@kory.org',
    enabled:true,
    phone: 3623102
  },
  {
    id: '74efb446-fe77-4697-8a60-44de85872adb',
    name: 'Chelsey Dietrich',
    username: 'Kamren',
    email: 'Lucio_Hettinger@annie.ca',
    enabled:true,
    phone: 1051203
  },
  {
    id: '15a36b5e-0a41-4f2f-9413-04655ccff3d6',
    name: 'Mrs. Dennis Schulist',
    username: 'Leopoldo_Corkery',
    email: 'Karley_Dach@jasper.info',
    enabled:true,
    phone: 5862081
  },
  {
    id: '6a0d76e4-6976-40a8-b845-dd3a392abad8',
    name: 'Kurtis Weissnat',
    username: 'Elwyn.Skiles',
    email: 'Telly.Hoeger@billy.biz',
    enabled:true,
    phone: 7452263
  },
  {
    id: '2f9973f2-ee74-4bef-bafb-1f841f5b4f97',
    name: 'Nicholas Runolfsdottir V',
    username: 'Maxime_Nienow',
    email: 'Sherwood@rosamond.me',
    enabled:true,
    phone: 9235392
  },
  {
    id: 'a35a6b6e-6635-4843-9d07-2b2c426d32ac',
    name: 'Glenna Reichert',
    username: 'Delphine',
    email: 'Chaim_McDermott@dana.io',
    enabled:true,
    phone: 2582826
  },
  {
    id: '5ba11905-0248-4a57-a912-b38c0a07f44d',
    name: 'Clementina DuBuque',
    username: 'Moriah.Stanton',
    email: 'Rey.Padberg@karina.biz',
    enabled:true,
    phone: 8987275
  }
]`
