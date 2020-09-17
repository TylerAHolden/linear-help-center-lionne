import Head from 'next/head';
import styled from 'styled-components';
import ConfigFileGenerator from '../components/ConfigFileGenerator';

const Header = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Main = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Linear Help Center</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Main>
        <Header>Linear Help Center</Header>
        <ConfigFileGenerator />
      </Main>
    </Container>
  );
}
