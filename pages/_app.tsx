import App from "next/app";
import Head from "next/head";
import Link from "next/link";
import Styled from "styled-components";
import { Container } from "../components/layout";
import "../styles/app.css";

const Header = Styled.header`
  padding: 1rem;
  background: var(--bg-surface);
  margin-bottom: 2rem;

  main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  nav {
    margin-left: 3rem;
  }

  a {
    padding: var(--text-padding-y) var(--text-padding-x);
    color: var(--body);

    &:hover {
      text-decoration: none;
    }
  }

  b {
    color: var(--body);
    font-weight: var(--font-weight-large);
  }
`;

export default class MyApp extends App {
  render() {
    return (
      <>
        <Head>
          <title>Okane Watch</title>
        </Head>
        <Header>
          <Container>
            <b>Okane Watch</b>
            <nav>
              <Link href="/">Overview</Link>
              <Link href="/transactions">Transactions</Link>
              <Link href="/people">People</Link>
            </nav>
          </Container>
        </Header>
        <Container>
          <this.props.Component {...this.props.pageProps} />
        </Container>
      </>
    );
  }
}
