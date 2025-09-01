import UserInfoProvider from './_context/UserInfoProvider';

export default async function MypageLayout({ children }) {
  return <UserInfoProvider>{children}</UserInfoProvider>;
}
