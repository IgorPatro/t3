import React from "react";
import { type NextPage, type GetServerSideProps } from "next";
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
  const [userInput, setUserInput] = React.useState("");

  const allUsersQuery = api.user.getAll.useQuery();
  const userQuery = api.user.getOne.useQuery({
    id: "00e44f05-dd7d-42fe-95a1-7ffc1edb8235",
  });

  const registerMutation = api.auth.register.useMutation();
  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const meQuery = api.auth.me.useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      firstName: "Igor",
      lastName: "Patro",
      email: `i.patro@wp.pl`,
      password: "123456",
      repPassword: "123456",
    });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-4xl font-bold">
          Hello {userQuery.isSuccess && userQuery.data?.firstName}!
        </h1>
        <ul>
          {allUsersQuery.isSuccess &&
            allUsersQuery.data.map((user) => (
              <li key={user.id}>{user.firstName}</li>
            ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="First name"
          />
        </form>
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

  const me = await ssg.auth.me.fetch().catch(() => false);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
