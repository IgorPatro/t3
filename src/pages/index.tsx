import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { isSuccess, data } = api.example.hello.useQuery({ text: "from tRPC" });
  const all = api.example.getAll.useQuery();

  console.log(all.data);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-4xl font-bold">Hello world!</h1>
        {isSuccess && data.greeting}
      </main>
    </>
  );
};

export default Home;
