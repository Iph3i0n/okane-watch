import React from "react";
import { InvisibleButton, ThemeButton } from "$components/button";
import { SelectDate } from "$components/form";
import { UseCurrentUser, UserProvider } from "$contexts/react-user";
import { UiTextProvider, UseUiText } from "$contexts/uitext";
import ApiClient from "$services/api";
import { User } from "$types/person";
import { DateObject, ToDateString } from "$types/utility";
import C from "$utils/class-name";
import { ClearAuth, OverrideOptions } from "$utils/cookies";
import { GetDateRangeObjects } from "$utils/date-range";
import { UpdateQueryString } from "$utils/url";
import App, { AppContext, AppInitialProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Styled from "styled-components";
import { BreakPoints, Col, Container, Row } from "../components/layout";
import { HeaderImageIncludes } from "$resources/header-images";

import "../styles/app.css";
import { useRouter } from "next/router";
import { IconBurger } from "$components/icons";
import { LinkButton } from "$components/text";

const Header = Styled.header`
  background: var(--bg-surface);
  margin: 0 0 var(--block-padding);
  padding: var(--block-padding);

  .right-panel {
    margin-left: auto;
  }

  nav {
    overflow: hidden;
    transition: height var(--animation-duration);
  }

  a {
    display: block;
    padding: var(--text-padding-y) 0;
    color: var(--body);

    &:hover {
      text-decoration: none;
    }
  }

  b {
    color: var(--body);
    font-weight: var(--font-weight-large);
  }

  section {
    margin-bottom: 0;
  }

  @media screen and (min-width: ${BreakPoints.md}) {
    a {
      display: inline-block;
      padding: var(--text-padding-y) var(--text-padding-x);
    }

    nav {
      height: 100% !important;
      display: flex;
      align-items: center;

      section {
        width: 100%;

        a:first-child {
          padding-left: 0;
        }
      }
    }

    button {
      display: none;
    }
  }
`;

const AppTitleContainer = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  

  @media screen and (min-width: ${BreakPoints.md}) {
    height: 100%;
  }
`;

type MyAppProps = AppInitialProps & {
  range: { from: DateObject; to: DateObject };
  uitext: any;
  user: User;
  locale: string;
};

async function GetUser() {
  try {
    return await ApiClient.AuthCheck();
  } catch {
    return undefined;
  }
}

const AppHeader: React.FC<{
  range: { from: DateObject; to: DateObject };
  loading: boolean;
}> = ({ range, loading }) => {
  const [open, set_open] = React.useState(false);
  const uitext = UseUiText();
  const router = useRouter();
  const user = UseCurrentUser();

  React.useEffect(() => {
    if (loading) set_open(false);
  }, [loading]);

  return (
    <Header>
      <Container>
        <Row>
          <Col xs="12" md="7" no_card>
            <nav style={{ height: open ? 170 : 26 }}>
              <Row>
                <Col xs="12" lg="3" no_card>
                  <AppTitleContainer>
                    <b>{uitext.app_title}</b>
                    <InvisibleButton
                      type="button"
                      onClick={() => set_open(!open)}
                    >
                      <IconBurger colour="var(--body)" width="24" height="24" />
                    </InvisibleButton>
                  </AppTitleContainer>
                </Col>
                <Col xs="12" lg="9" no_card>
                  <Link href="/">{uitext.overview}</Link>
                  <Link href="/transactions">{uitext.transactions}</Link>
                  <Link href="/people">{uitext.people}</Link>
                  {user && (
                    <LinkButton action={ClearAuth}>{uitext.logout}</LinkButton>
                  )}
                </Col>
              </Row>
            </nav>
          </Col>
          <Col xs="12" md="5" display={open} no_card>
            <div className="right-panel">
              <Row>
                <Col xs="12" md="6" no_card>
                  <SelectDate
                    date={range.from}
                    set_date={(d) =>
                      UpdateQueryString(router, ["from", ToDateString(d)])
                    }
                  >
                    {uitext.from}
                  </SelectDate>
                </Col>
                <Col xs="12" md="6" no_card>
                  <SelectDate
                    date={range.to}
                    set_date={(d) =>
                      UpdateQueryString(router, ["to", ToDateString(d)])
                    }
                  >
                    {uitext.to}
                  </SelectDate>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </Header>
  );
};

export default class MyApp extends App<MyAppProps, {}, { loading: boolean }> {
  constructor(props: MyAppProps) {
    super(props as any);
    this.state = { loading: false };
  }

  static async getInitialProps(app: AppContext): Promise<MyAppProps> {
    if (app.ctx.req) OverrideOptions({ req: app.ctx.req, res: app.ctx.res });
    const user = await GetUser();
    const original = await App.getInitialProps({
      ...app,
      ctx: { ...app.ctx, user },
    } as any);
    const uitext = await ApiClient.UiText({
      locale: app.ctx.locale || app.ctx.defaultLocale || "en-GB",
    });
    return {
      ...original,
      range: GetDateRangeObjects(app.ctx),
      uitext: uitext.data,
      locale: uitext.actual,
      user,
    };
  }

  componentDidMount(): void {
    const router = this.props.router;
    router.events.on("routeChangeStart", () =>
      this.setState({ loading: true })
    );
    router.events.on("routeChangeError", () =>
      this.setState({ loading: false })
    );
    router.events.on("routeChangeComplete", () =>
      this.setState({ loading: false })
    );
  }

  render() {
    return (
      <UiTextProvider uitext={this.props.uitext}>
        <UserProvider user={this.props.user}>
          <Head>
            <title>{this.props.uitext.app_title}</title>
            <HeaderImageIncludes />
          </Head>
          <AppHeader range={this.props.range} loading={this.state.loading} />
          <Container className={C(["loading", this.state.loading])}>
            <this.props.Component {...this.props.pageProps} />
          </Container>
        </UserProvider>
      </UiTextProvider>
    );
  }
}
