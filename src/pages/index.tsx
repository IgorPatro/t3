import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import Image from "next/image";
import cover from "@/assets/images/cover.png";
import { appRouter } from "@/server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { createTRPCContext } from "@/server/api/trpc";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

const Home: NextPage = () => {
  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const meQuery = api.auth.me.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-4xl font-bold">
          Hello {meQuery.isSuccess && meQuery.data.user.id}!
        </h1>
        <button
          onClick={() =>
            loginMutation.mutate({
              email: "i.patro@wp.pl",
              password: "123456",
            })
          }
        >
          Zaloguj
        </button>
        <Image src={cover} alt="Cover" />
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps = async (ctx: CreateNextContextOptions) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createTRPCContext(ctx),
    transformer: superjson,
  });

  // Here is caching also - if I will fetch this on clinet I will get cached result <3
  const me = await ssg.auth.me.fetch().catch(() => false);
  const users = await ssg.user.getAll.fetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
