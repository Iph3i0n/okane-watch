import { SelectDate } from "$components/form";
import { UiTextProvider } from "$contexts/uitext";
import ApiClient from "$services/api";
import { DateObject, ToDateString } from "$types/utility";
import C from "$utils/class-name";
import { GetDateRangeObjects } from "$utils/date-range";
import { UpdateQueryString } from "$utils/url";
import App, { AppContext, AppInitialProps } from "next/app";
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
    flex: 1;
    margin-left: 3rem;
  }

  .date-selector {
    display: grid;
    grid-template-columns: auto auto;
    gap: var(--block-padding);

    input {
      flex: 0;
      background: var(--bg-white);
      max-width: 100px;
    }
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

type MyAppProps = AppInitialProps & {
  range: { from: DateObject; to: DateObject };
  uitext: any;
};

export default class MyApp extends App<MyAppProps, {}, { loading: boolean }> {
  constructor(props: MyAppProps) {
    super(props as any);
    this.state = { loading: false };
  }

  static async getInitialProps(app: AppContext): Promise<MyAppProps> {
    const original = await App.getInitialProps(app);
    return {
      ...original,
      range: GetDateRangeObjects(app.ctx),
      uitext: await ApiClient.UiText({
        locale: app.ctx.locale || app.ctx.defaultLocale || "en-GB",
      }),
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
        <Head>
          <title>{this.props.uitext.app_title}</title>
        </Head>
        <Header>
          <Container>
            <b>{this.props.uitext.app_title}</b>
            <nav>
              <Link href="/">{this.props.uitext.overview}</Link>
              <Link href="/transactions">{this.props.uitext.transactions}</Link>
              <Link href="/people">{this.props.uitext.people}</Link>
            </nav>
            <div className="date-selector">
              <SelectDate
                date={this.props.range.from}
                set_date={(d) => UpdateQueryString("from", ToDateString(d))}
              >
                {this.props.uitext.from}
              </SelectDate>
              <SelectDate
                date={this.props.range.to}
                set_date={(d) => UpdateQueryString("to", ToDateString(d))}
              >
                {this.props.uitext.to}
              </SelectDate>
            </div>
          </Container>
        </Header>
        <Container className={C(["loading", this.state.loading])}>
          <this.props.Component {...this.props.pageProps} />
        </Container>
      </UiTextProvider>
    );
  }
}
