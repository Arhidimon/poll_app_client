import React from 'react';
import IUser from './interfaces/IUser';
export interface IAuthContext {
  user: null | IUser;
  signin: (login: string) => void;
  signout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  user: null,
  signin: () => null,
  signout: () => null,
});
