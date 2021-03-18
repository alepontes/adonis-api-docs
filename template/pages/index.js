import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import {
  Container,
  Nav,
  SubContainer,
  Header,
  Group,
  Content,
  EndpointList,
  Endpoint,
  GroupTitle,
  RulesContainer,
} from '../components';

export async function getStaticProps(context) {

  const dir = path.resolve('./public', 'routes');
  const data = fs.readFileSync(dir, 'utf-8');

  return { props: { data: JSON.parse(data) } }
}

const Route = route => {
  return (
    <EndpointList>
      <Endpoint key={Math.random()}>{route.verbs[0]} {route.route}</Endpoint>

      <RulesContainer>
        <p>{ JSON.stringify(route.rules) || 'No Validation' }</p>
      </RulesContainer>

    </EndpointList>
  );
}

const RouterGroup = group => {
  return (
    <Group key={Math.random(group.group) * 99999}>
      <GroupTitle>{group.group}</GroupTitle>
      { group.routes.map(route => Route(route))}
    </Group>
  );
}

export default function Home({ data }) {

  return (
    <Container>
      <Head>
        <title>Adonis API Docs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav></Nav>

      <SubContainer>

        <Content>

          <Header></Header>

          {data.map(group => RouterGroup(group))}

        </Content>

      </SubContainer>

    </Container>
  )
}
