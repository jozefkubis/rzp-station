import Header from "../_components/Header";

export const metadata = {
  title: "Fotky",
};

function page() {
  return (
    <div>
      <Header />
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-8xl font-bold text-primary-700">Photos</h1>
      </div>
    </div>
  );
}

export default page;
