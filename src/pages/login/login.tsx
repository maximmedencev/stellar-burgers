import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err: any) {
      setErrorText(err.message || 'Неверный email или пароль');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
