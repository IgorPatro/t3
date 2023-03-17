"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const react_1 = __importDefault(require("react"));
const head_1 = __importDefault(require("next/head"));
const api_1 = require("@/utils/api");
const image_1 = __importDefault(require("next/image"));
const cover_png_1 = __importDefault(require("@/assets/images/cover.png"));
const root_1 = require("@/server/api/root");
const ssg_1 = require("@trpc/react-query/ssg");
const superjson_1 = __importDefault(require("superjson"));
const trpc_1 = require("@/server/api/trpc");
const HomePage = () => {
    const loginMutation = api_1.api.auth.login.useMutation({
        onSuccess: (data) => {
            console.log(data);
        },
    });
    const meQuery = api_1.api.auth.me.useQuery();
    const random = api_1.api.randomNumber.useSubscription(undefined, {
        onData(n) {
            console.log(n);
        },
    });
    return (<>
      <head_1.default>
        <title>Create T3 App</title>
        <meta name="description" content="Description"/>
        <link rel="icon" href="/favicon.ico"/>
      </head_1.default>
      <main>
        <h1 className="text-4xl font-bold">
          Hello {meQuery.isSuccess && meQuery.data.user.id}!
        </h1>
        <button className="btn" onClick={() => loginMutation.mutate({
            email: "i.patro@wp.pl",
            password: "123456",
        })}>
          Zaloguj
        </button>
        <button className="btn">Emit</button>
        <image_1.default src={cover_png_1.default} alt="Cover"/>
      </main>
    </>);
};
exports.default = HomePage;
const getServerSideProps = async (ctx) => {
    const ssg = (0, ssg_1.createProxySSGHelpers)({
        router: root_1.appRouter,
        ctx: (0, trpc_1.createTRPCContext)(ctx),
        transformer: superjson_1.default,
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
exports.getServerSideProps = getServerSideProps;
