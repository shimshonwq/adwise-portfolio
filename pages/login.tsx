import Head from 'next/head'
import AdminCms from '../components/admin/AdminCms'

export default function LoginAdminPage() {
  return (
    <>
      <Head>
        <title>Admin — Adwise Media</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdminCms />
    </>
  )
}
