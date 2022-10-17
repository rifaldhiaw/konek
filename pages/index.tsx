import dynamic from "next/dynamic";

const Home = dynamic(() => import("../components/Home"), { ssr: false });

const HomeWrapper = () => {
  return <Home />;
};

export default HomeWrapper;
