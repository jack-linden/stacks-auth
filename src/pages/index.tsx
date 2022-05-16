import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useConnect, signMessage, UserData } from "@stacks/connect-react";
import { getCsrfToken, signIn } from "next-auth/react";
import { appDetails, userSession } from "./_app";

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

    const nonce = await getCsrfToken();
    const domain = window.location.host;
    const address = stacksUser.profile.stxAddress.mainnet;
    const callbackUrl = "/protected";
    let message = `${domain} wants you to sign in with your Stacks account: ${address}\n`;
    message += `URI: ${domain}`;
    message += `Nonce: ${nonce}`;
    message += `Issued At: ${new Date()}`;
    sign({
      message,
      onFinish: ({ signature }) => {
        signIn("credentials", {
          message: JSON.stringify(message),
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
