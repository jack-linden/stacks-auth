import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useConnect, signMessage, UserData } from "@stacks/connect-react";
import { getCsrfToken, signIn } from "next-auth/react";
import { appDetails, userSession } from "./_app";
import { StacksMessage } from "../utils/stacksMessage";

const Home: NextPage = () => {
  const { doOpenAuth, sign, isAuthenticating, authenticate } = useConnect();
  const [stacksUser, setStacksUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setStacksUser(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setStacksUser(userSession.loadUserData());
    }
  }, [userSession]);

  const handleLogin = () => {
    authenticate({
      appDetails,
      onFinish: ({ userSession }) => setStacksUser(userSession.loadUserData()),
    });
  };

  const handleSign = async () => {
    if (!stacksUser) return;

    const callbackUrl = "/protected";
    const stacksMessage = new StacksMessage({
      domain: window.location.host,
      address: stacksUser.profile.stxAddress.mainnet,
      statement: "Sign in with Stacks to the app.",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce: await getCsrfToken(),
    });

    const message = stacksMessage.prepareMessage();

    sign({
      message,
      onFinish: ({ signature }) => {
        signIn("credentials", {
          message: message,
          redirect: false,
          signature,
          callbackUrl,
        });
      },
    });
  };

  return (
    <div>
      {stacksUser ? null : (
        <button onClick={handleLogin}>Sign-In with Stacks</button>
      )}
      {stacksUser ? <button onClick={handleSign}>Sign message</button> : null}
    </div>
  );
};

export default Home;
