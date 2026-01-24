import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  activeSection
}) => {
  const getIconType = (section: 'constructor' | 'feed' | 'profile') =>
    activeSection === section ? 'primary' : 'secondary';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type={getIconType('constructor')} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={getIconType('feed')} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <NavLink to='/' aria-label='На главную'>
          <Logo className='' />
        </NavLink>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type={getIconType('profile')} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
