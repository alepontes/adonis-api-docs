import Head from 'next/head';
import fs from 'fs';
import path from 'path';

export async function getStaticProps(context) {

  const dirRelativeToPublicFolder = 'routes';
  const dir = path.resolve('./public', dirRelativeToPublicFolder);
  const data = fs.readFileSync(dir, 'utf-8');

  return { props: { data: JSON.parse(data) } }

}

export default function Home({ data }) {

  return (
    <div>
      <Head>
        <title>Adonis API Docs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { data.map(route => (<p key={Math.random()}>{route.route}</p>))}

    </div>
  )
}
