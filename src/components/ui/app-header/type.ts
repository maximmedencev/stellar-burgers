export type TAppHeaderUIProps = {
  userName: string | undefined;
  activeSection?: 'constructor' | 'feed' | 'profile';
  onNavigate: (path: string) => void;
};
