import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "lib/axios";
import { v4 as uuidv4 } from 'uuid';

const remoteBffUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const url = process.env.NEXT_PUBLIC_URL;

const Home: NextPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const [nameText, setNameText] = useState("John Doe");
  const [messages, setMessages] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<any>(`${url}/api/user-info`);

      if (data) {
        setAuthenticated(data.isLogin);
        setUsername(data.name);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>
          {!authenticated && (
            <a href={`${remoteBffUrl}/login?redirectUrl=${url}`}>Login</a>
          )}
          {authenticated && (
            <>
              <b>{username}</b>{" "}
              <a href={`${remoteBffUrl}/logout?redirectUrl=${url}`}>Logout</a>
            </>
          )}
        </p>
        <p>
          <input
            type="text"
            defaultValue={nameText}
            onKeyUp={(event) => setNameText(event.currentTarget.value)}
          />
          <button
            onClick={async () => {
              try {
                let { data } = await axios.get(`${url}/api/hello/${nameText}`, {
                  withCredentials: true,
                });

                setMessages(messages.concat(data.name));
              } catch (error: any) {
                //console.log(error);
                window.location.href = `${remoteBffUrl}/login?redirectUrl=${url}`;
              }
            }}
          >
            Call /api/hello
          </button>
        </p>
        <ul>
          {messages.map((message) => (
            <li key={uuidv4()}>{message}</li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;