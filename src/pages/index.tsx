import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import Image from "next/image";
import cover from "@/assets/images/cover.png";

const Home: NextPage = () => {
  const [userInput, setUserInput] = React.useState("");

  const helloQuery = api.example.hello.useQuery();
  const allUsersQuery = api.user.getAll.useQuery();
  const userQuery = api.user.getOne.useQuery({
    id: "00e44f05-dd7d-42fe-95a1-7ffc1edb8235",
  });

  const createUserMutation = api.user.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({
      firstName: userInput,
      lastName: "Doe",
      email: `${Math.random().toString(16)}@test.pl`,
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
        {helloQuery.isSuccess && helloQuery.data.greeting}
        <ul>
          {allUsersQuery.isSuccess &&
            allUsersQuery.data.users.map((user) => (
              <li key={user.id}>{user.firstName}</li>
            ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </form>
        <Image src={cover} alt="Cover" />
      </main>
    </>
  );
};

export default Home;
