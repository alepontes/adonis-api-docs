import Head from 'next/head'
import styles from '../styles/Home.module.css'
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
    <div className={styles.container}>
      <Head>
        <title>Adonis API Docs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { data.map(route => (<p key={Math.random()}>{route.route}</p>))}

    </div>
  )
}
