import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userSelector, updateUserData } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(userSelector);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged || !user) return;

    try {
      const updateData: Partial<typeof formValue> = {};

      if (formValue.name !== user.name) updateData.name = formValue.name;
      if (formValue.email !== user.email) updateData.email = formValue.email;
      if (formValue.password) updateData.password = formValue.password;

      await dispatch(updateUserData(updateData)).unwrap();
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
