import PageContainer from "@/components/layouts/PageContainer";
import AppHero from "./-compoents/AppHero";
import NewIn from "./-compoents/NewIn";
import Trending from "./-compoents/Trending";

export default function RouteComponent() {
  return (
    <>
      <div className="mb-22 mt-12">
        <AppHero />
      </div>
      <PageContainer>
        {/*new in*/}
        <NewIn />
        {/*//trending*/}
        <Trending />
      </PageContainer>
    </>
  );
}
